from flask import Flask, request, send_file
from pymongo import MongoClient
from datetime import datetime
import pandas as pd
import io
from flask_cors import CORS
from dotenv import load_dotenv
import os
from zipfile import ZipFile

load_dotenv()

app = Flask(__name__)
CORS(app)

mongo_uri = os.getenv("MONGO_URI")

client = MongoClient(mongo_uri)
db = client['tracker']
users_collection = db['users']
shifts_collection = db['shifts']

@app.route('/api/generate-report', methods=['POST'])
def generate_report():
    data = request.json
    start_date = datetime.strptime(data['startDate'], '%Y-%m-%d')
    end_date = datetime.strptime(data['endDate'], '%Y-%m-%d')

    users = list(users_collection.find({}))
    date_range = pd.date_range(start=start_date, end=end_date)

    wfo_status_df = pd.DataFrame(columns=['Username'] + [date.strftime('%Y-%m-%d') for date in date_range])

    rows = []
    allowance_data = {}

    shift_type_df = pd.DataFrame(columns=['Username'] + [date.strftime('%Y-%m-%d') for date in date_range])

    for user in users:
        username = user['name']
        row = {'Username': username}
        shift_type_row = {'Username': username}

        shifts = list(shifts_collection.find({
            'user': user['_id'],
            'date': {'$gte': start_date, '$lte': end_date}
        }))

        shift_dict = {shift['date'].strftime('%Y-%m-%d'): shift for shift in shifts}

        non_zero_shift_allowance = 0
        non_zero_travel_allowance = 0
        total_shift_allowance = 0
        total_travel_allowance = 0
        total_office_workplace = 0
        total_home_workplace = 0

        for date in date_range:
            date_str = date.strftime('%Y-%m-%d')
            if date_str in shift_dict:
                shift = shift_dict[date_str]
                row[date_str] = shift['workLocation']
                shift_type_row[date_str] = shift['shiftType']

                # Count total office and home workplace
                if shift['workLocation'] == 'office':
                    total_office_workplace += 1
                elif shift['workLocation'] == 'home':
                    total_home_workplace += 1

                if shift['shiftAllowance'] > 0:
                    non_zero_shift_allowance += 1
                    total_shift_allowance += shift['shiftAllowance']
                if shift['travelAllowance'] > 0:
                    non_zero_travel_allowance += 1
                    total_travel_allowance += shift['travelAllowance']
            elif date.weekday() in [5, 6]:
                row[date_str] = 'WO'
                shift_type_row[date_str] = 'WO'
            else:
                row[date_str] = ''
                shift_type_row[date_str] = ''

        # Add total office and home workplace to the row
        row['Total Office Workplace'] = total_office_workplace
        row['Total Home Workplace'] = total_home_workplace

        rows.append(row)
        shift_type_df = pd.concat([shift_type_df, pd.DataFrame([shift_type_row])], ignore_index=True)

        allowance_data[username] = {
            'No of days eligible for shift allowance': non_zero_shift_allowance,
            'Work from office': non_zero_travel_allowance,
            'Shift Allowance': total_shift_allowance,
            'Travel Allowance': total_travel_allowance,
            'Total Allowance': total_shift_allowance + total_travel_allowance
        }

    wfo_status_df = pd.concat([pd.DataFrame(rows)], ignore_index=True)

    output_wfo_status = io.BytesIO()
    wfo_status_df.to_csv(output_wfo_status, index=False)
    output_wfo_status.seek(0)

    # Convert shift_type_df to CSV
    output_shift_type = io.BytesIO()
    shift_type_df.to_csv(output_shift_type, index=False)
    output_shift_type.seek(0)

    allowance_df = pd.DataFrame.from_dict(allowance_data, orient='index')
    allowance_df.reset_index(inplace=True)
    allowance_df.rename(columns={'index': 'Username'}, inplace=True)

    output_allowance = io.BytesIO()
    allowance_df.to_csv(output_allowance, index=False)
    output_allowance.seek(0)

    zip_buffer = io.BytesIO()
    with ZipFile(zip_buffer, 'w') as zip_file:
        zip_file.writestr('WFO_status.csv', output_wfo_status.getvalue())  # Renamed report
        zip_file.writestr('allowance_report.csv', output_allowance.getvalue())
        zip_file.writestr('shift_type_report.csv', output_shift_type.getvalue())  # Shift type report
    zip_buffer.seek(0)

    return send_file(zip_buffer, mimetype='application/zip', as_attachment=True, download_name='reports.zip')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6500)

