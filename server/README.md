# Setting up backend

First, you have to install **PostgreSQL** on your local machine. I recommend watching a tutorial on this matter, since installation can differ on which operating system you are using. Link to the PostgreSQL website: <https://www.postgresql.org/>

After you have successfully installed PostgreSQL and you can make some queries to it, open VSCode and move to the **/server** folder on the project. Then type to the terminal:

```
npm install
```

Then you have to create a new database on your local postgreSQL server. Type this command to **psql-terminal**:

```
CREATE DATABASE businesstravelapp;
```

This will create a new database called "businesstravelapp". You will have to specify exactly this name, because this database name is defined on the database_url that prisma will use to create all the tables.

Then create a new **.env** file inside **/server**. Add the database url inside it. It should be in this kind of format:

```
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME?schema=public
```

For example:

```
DATABASE_URL=postgresql://postgres:123456@localhost:5432/businesstravelapp?schema=public
```

Note that **postgres** is the default user and **5432** is the default portnumber. **MAKE SURE** that the database_name is named **businesstravelapp** otherwise prisma will not create the tables to the correct database.

After you have added a proper database_url to your .env file. Then you have to push the current prisma schema to your local PostgreSQL database. Type this command to your VSCode terminal and make sure you are inside **/server** folder.

```
npx prisma db push
```
This should give you some kind of response message to the terminal that it has succeeded.

Now check on your local PostgreSQL server that there are newly created tables inside the database called **businesstravelapp**.

Now you should check that the endpoints are working. You can use for example **Postman** to test the endpoints. When testing endpoints remember to start the express-server by typing in the terminal:

```
npm run dev
```

 You can try a quick Postman request by making a GET request to this url: http://localhost:3005/api/reports. If it returns and empty Array **[]**, then it means that you have succesfully queried your database.


# Matkalasku REST API Enpoints

### Reports
___

**/api/reports**
  - **GET**: Get all reports
  - **POST**: Create a new report

**/api/reports/:id**
  - **GET**: Get a report
  - **PATCH**: Update a report
  - **DELETE**: Delete a report

  ### Examples
___


#### Query Parameters
##### Filtering
**/api/reports?column_name=filter_value**
##### Sorting
**/api/reports?sortBy=column_name&isAscending=true**
##### Pagination
**/api/reports?page=1&limit=5**
### Examples
___

#### Request

**GET** **/api/reports/:id**

#### Response

```json
{
  "id": 4,
  "description": "Trip to Italy and Spain",
  "startDate": "2024-08-23T00:00:00.000Z",
  "endDate": "2024-08-25T00:00:00.000Z",
  "kilometerAllowances": [
    {
      "id": 2,
      "description": "Business trip from Helsinki to India",
      "vehicleInfo": "BMW 3 Series",
      "route": [
        "Helsinki",
        "Munich"
      ],
      "distance": 585,
      "sum": 150.75,
      "startDate": "2024-08-15T00:00:00.000Z",
      "endDate": "2024-08-15T00:00:00.000Z",
      "passengers": 5,
      "passengerNames": [
        "Alice",
        "Bob",
        "Charlie",
        "Maddie"
      ],
      "reportId": 4
    }
  ],
  "dailyAllowances": [
    {
      "id": 2,
      "description": "This is a trip to Italy and spain",
      "totalAllowances": 3,
      "freeMeals": 10,
      "country": "India",
      "over_5_km": true,
      "over_15_km": true,
      "travelingByShipOrPlane": true,
      "startDate": "2024-08-15T00:00:00.000Z",
      "endDate": "2024-08-20T00:00:00.000Z",
      "reportId": 4
    }
  ],
  "otherExpenses": [
    {
      "id": 3,
      "type": "Food expense",
      "date": "2024-08-23T00:00:00.000Z",
      "amount": 250.75,
      "country": "Italy",
      "vat": 24,
      "sum": 500.93,
      "description": "Taxi fare from the airport to the hotel",
      "comment": "Taxi was delayed due to heavy traffic",
      "reportId": 4
    }
  ]
}
```

#### Request

**POST** **/api/reports**

body
```json
{
  "description": "Trip to Italy and Spain",
  "startDate": "2024-08-23",
  "endDate": "2024-08-25"
}
```

#### Response

```json
{
  "id": 4,
  "description": "Trip to Italy and Spain",
  "startDate": "2024-08-23",
  "endDate": "2024-08-25"
}
```

### Kilometer Allowances
___

**/api/kilometer-allowances**
  - **GET**: Get all kilometer allowances
  - **POST**: Create a new kilometer allowance

**/api/kilometer-allowances/:id**
  - **GET**: Get a kilometer allowance
  - **PATCH**: Update a kilometer allowance
  - **DELETE**: Delete a kilometer allowance

  ### Examples
___

#### Request

**GET** **/api/kilometer-allowances/:id**

#### Response

```json
{
    "id": 1,
    "description": "Business trip from Helsinki to India",
    "vehicleInfo": "BMW 3 Series",
    "distance": 585,
    "totalCost": 150.75,
    "startPoint": "Helsinki",
    "endPoint": "Spain",
    "startLat": 60.1684,
    "startLng": 24.9334,
    "endLat": 40.416775,
    "endLng": -3.703790,
    "startDate": "2024-08-15T00:00:00.000Z",
    "endDate": "2024-08-15T00:00:00.000Z",
    "passengers": 5,
    "passengerNames": [
      "Alice",
      "Bob",
      "Charlie",
      "Maddie"
    ],
    "reportId": 1
  }
```

#### Request

**POST** **/api/kilometer-allowances**

body
```json
 {
    "description": "Business trip from Helsinki to Munich",
    "vehicleInfo": "BMW 3 Series",
    "passengers": 5,
    "distance": 585.0,
    "totalCost": 150.75,
    "startPoint": "Helsinki",
    "endPoint": "Spain",
    "startLat": 60.1684,
    "startLng": 24.9334,
    "endLat": 40.416775,
    "endLng": -3.703790,
    "startDate": "2024-08-15",
    "endDate": "2024-08-15",
    "passengerNames": ["Alice", "Bob", "Charlie", "Maddie"],
    "reportId": 6
}
```

#### Response

```json
{
    "id": 5,
    "description": "Business trip from Helsinki to Munich",
    "vehicleInfo": "BMW 3 Series",
    "passengers": 5,
    "route": ["Helsinki", "Munich"],
    "distance": 585.0,
    "totalCost": 150.75,
    "startPoint": "Helsinki",
    "endPoint": "Spain",
    "startLat": 60.1684,
    "startLng": 24.9334,
    "endLat": 40.416775,
    "endLng": -3.703790,
    "startDate": "2024-08-15",
    "endDate": "2024-08-15",
    "passengerNames": ["Alice", "Bob", "Charlie", "Maddie"],
    "reportId": 6
}
```

### Daily Allowances
___

**/api/daily-allowances**
  - **GET**: Get all daily allowances
  - **POST**: Create a new daily allowance

**/api/daily-allowances/:id**
  - **GET**: Get a daily allowance
  - **PATCH**: Update a daily allowance
  - **DELETE**: Delete a daily allowance

  ### Examples
___

#### Request

**GET** **/api/daily-allowances/:id**

#### Response

```json
{
  "id": 1,
  "description": "This is a trip to India",
  "totalAllowances": 3,
  "freeMeals": 10,
  "country": "India",
  "over_5_km": true,
  "over_15_km": true,
  "travelingByShipOrPlane": true,
  "startDate": "2024-08-15T00:00:00.000Z",
  "endDate": "2024-08-20T00:00:00.000Z",
  "reportId": 1
}
```

#### Request

**POST** **/api/daily-allowances**

body
```json
{
  "description": "This is a trip to Italy and spain",
  "totalAllowances": 3,
  "freeMeals": 10,
  "country": "India",
  "over_5_km": true,
  "over_15_km": true,
  "travelingByShipOrPlane": true,
  "startDate": "2024-08-15",
  "endDate": "2024-08-20",
  "reportId": 4
}
```

#### Response

```json
{
  "id": 4,
  "description": "This is a trip to Italy and spain",
  "totalAllowances": 3,
  "freeMeals": 10,
  "country": "India",
  "over_5_km": true,
  "over_15_km": true,
  "travelingByShipOrPlane": true,
  "startDate": "2024-08-15",
  "endDate": "2024-08-20",
  "reportId": 4
}
```

### Other Expenses
___

**/api/other-expenses**
  - **GET**: Get all expenses
  - **POST**: Create a new expense

**/api/other-expenses/:id**
  - **GET**: Get an expense
  - **PATCH**: Update an expense
  - **DELETE**: Delete an expense

  ### Examples
___

#### Request

**GET** **/api/other-expenses/:id**

#### Response

```json
{
  "id": 1,
  "type": "Expense Type",           
  "date": "2024-10-06T00:00:00.000Z", 
  "amount": 150.00,                   
  "country": "Country Name",         
  "vat": 15.00,                       
  "sum": 165.00,                    
  "description": "Description of the expense", 
  "comment": "Any additional comments", 
  "reportId": 174,                     
  "attachments": [                   
    {
      "fileName": "3b4eac80f1bb5b541fb6a044413b8dbe0016250b5abb2a7513918404cf5eb587",   
      "url": "https://bta-uploads.s3.eu-north-1.amazonaws.com/3b4eac80f1bb5b541fb6a044413b8dbe0016250b5abb2a7513918404cf5eb587?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA3M7AC3VHFOSXZSWC%2F20241006%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20241006T181636Z&X-Amz-Expires=360&X-Amz-Signature=8b97efc27574fecc288b35313363d48f4ce9362834d2356fe181180aab2230dc&X-Amz-SignedHeaders=host&x-id=GetObject"
    },
    {
      "fileName":"76c5f6aba58c35674a514f77fcbfed8ccc605e73f092572903ac31411123e28a",
      "url": "https://bta-uploads.s3.eu-north-1.amazonaws.com/76c5f6aba58c35674a514f77fcbfed8ccc605e73f092572903ac31411123e28a?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA3M7AC3VHFOSXZSWC%2F20241006%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20241006T181635Z&X-Amz-Expires=360&X-Amz-Signature=703e70750903dc7900f7d47861ec3cdfb98810d53f8fb1fd3bb961966039bd45&X-Amz-SignedHeaders=host&x-id=GetObject"
    }
  ]
}
```

#### Request

**POST** **/api/other-expenses**

body
```json
{
 "type": "Expense Type",           
  "date": "2024-10-06T00:00:00.000Z", 
  "amount": 150.00,                   
  "country": "Country Name",         
  "vat": 15.00,                       
  "sum": 165.00,                    
  "description": "Description of the expense", 
  "comment": "Any additional comments", 
  "reportId": 174,                     
  "attachments": [                   
    {
      "fileName": "3b4eac80f1bb5b541fb6a044413b8dbe0016250b5abb2a7513918404cf5eb587",   
      "url": "https://bta-uploads.s3.eu-north-1.amazonaws.com/3b4eac80f1bb5b541fb6a044413b8dbe0016250b5abb2a7513918404cf5eb587?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA3M7AC3VHFOSXZSWC%2F20241006%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20241006T181636Z&X-Amz-Expires=360&X-Amz-Signature=8b97efc27574fecc288b35313363d48f4ce9362834d2356fe181180aab2230dc&X-Amz-SignedHeaders=host&x-id=GetObject"
    },
    {
      "fileName":"76c5f6aba58c35674a514f77fcbfed8ccc605e73f092572903ac31411123e28a",
      "url": "https://bta-uploads.s3.eu-north-1.amazonaws.com/76c5f6aba58c35674a514f77fcbfed8ccc605e73f092572903ac31411123e28a?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA3M7AC3VHFOSXZSWC%2F20241006%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20241006T181635Z&X-Amz-Expires=360&X-Amz-Signature=703e70750903dc7900f7d47861ec3cdfb98810d53f8fb1fd3bb961966039bd45&X-Amz-SignedHeaders=host&x-id=GetObject"
    }
  ]
}
```

#### Response

```json
{
  "id": 4,
 "type": "Expense Type",           
  "date": "2024-10-06T00:00:00.000Z", 
  "amount": 150.00,                   
  "country": "Country Name",         
  "vat": 15.00,                       
  "sum": 165.00,                    
  "description": "Description of the expense", 
  "comment": "Any additional comments", 
  "reportId": 174,                     
  "attachments": [                   
    {
      "fileName": "3b4eac80f1bb5b541fb6a044413b8dbe0016250b5abb2a7513918404cf5eb587",   
      "url": "https://bta-uploads.s3.eu-north-1.amazonaws.com/3b4eac80f1bb5b541fb6a044413b8dbe0016250b5abb2a7513918404cf5eb587?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA3M7AC3VHFOSXZSWC%2F20241006%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20241006T181636Z&X-Amz-Expires=360&X-Amz-Signature=8b97efc27574fecc288b35313363d48f4ce9362834d2356fe181180aab2230dc&X-Amz-SignedHeaders=host&x-id=GetObject"
    },
    {
      "fileName":"76c5f6aba58c35674a514f77fcbfed8ccc605e73f092572903ac31411123e28a",
      "url": "https://bta-uploads.s3.eu-north-1.amazonaws.com/76c5f6aba58c35674a514f77fcbfed8ccc605e73f092572903ac31411123e28a?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA3M7AC3VHFOSXZSWC%2F20241006%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20241006T181635Z&X-Amz-Expires=360&X-Amz-Signature=703e70750903dc7900f7d47861ec3cdfb98810d53f8fb1fd3bb961966039bd45&X-Amz-SignedHeaders=host&x-id=GetObject"
    }
  ]
}
```

