import PDFDocument from "pdfkit";

const trip = {
    id: 1,
    description: "Trip to Lapland",
    startDate: "2024-08-23T00:00:00.000Z",
    endDate: "2024-08-25T00:00:00.000Z",
    kilometerAllowances: [
        {
            id: 1,
            description: "Business trip from Helsinki to India",
            vehicleInfo: "BMW 3 Series",
            route: ["Helsinki", "Munich"],
            distance: 585,
            sum: 150.75,
            startDate: "2024-08-15T00:00:00.000Z",
            endDate: "2024-08-15T00:00:00.000Z",
            passengers: 5,
            passengerNames: ["Alice", "Bob", "Charlie", "Maddie"],
            reportId: 1
        }
    ],
    dailyAllowances: [
        {
            id: 1,
            description: "This is a trip to India",
            totalAllowances: 3,
            freeMeals: 10,
            country: "India",
            over_5_km: true,
            over_15_km: true,
            travelingByShipOrPlane: true,
            startDate: "2024-08-15T00:00:00.000Z",
            endDate: "2024-08-20T00:00:00.000Z",
            reportId: 1
        }
    ],
    otherExpenses: [
      {
        "id": 1,
        "type": "Travel Expense",
        "date": "2024-08-23T00:00:00.000Z",
        "amount": 250.75,
        "country": "Finland",
        "vat": 24,
        "sum": 310.93,
        "description": "Taxi fare from the airport to the hotel",
        "comment": "Taxi was delayed due to heavy traffic",
        "reportId": 1
      },
      {
        "id": 2,
        "type": "Food expense",
        "date": "2024-08-23T00:00:00.000Z",
        "amount": 250.75,
        "country": "Finland",
        "vat": 24,
        "sum": 500.93,
        "description": "Taxi fare from the airport to the hotel",
        "comment": "Taxi was delayed due to heavy traffic",
        "reportId": 1
      }
    ],
  };

export const previewPdf = async (req, res) => {
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);
  
    // Add some content to the PDF
    // Title
    doc.fontSize(20).text(`${trip.description}`, { align: 'start' });
    doc.moveDown(0.5);
  
    // Description
    doc.fontSize(12).text(`Trip type`);
    doc.moveDown(0.5);
  
    doc.fontSize(11).text(`Malaga(ES)-Helsinki(FI)-Turku(FI)-Helsinki(FI)-Malaga(FI)`, {
      
    });
    doc.moveDown();
  
  
    doc.moveTo(50, doc.y)
       .lineTo(550, doc.y)
       .strokeColor('black')
       .stroke();
    doc.moveDown();
    doc.text(`Explanation of the trip`);
    doc.moveDown();
    
  
    doc.moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .strokeColor('black')
    .stroke();
  doc.moveDown(1.2);
  
  // Set a consistent width for the labels to ensure alignment
  const labelWidth = 250;  // Adjust this width based on your layout needs
  
  // START-DATE
  doc.fontSize(11).text('Start Date:', {
    continued: true,
    width: labelWidth, // Reserves space for the label
  });
  
  doc.text('2023-05-02', { align: "right"});
  doc.moveDown(0.7);
  
  // END-DATE
  doc.text('End Date:', {
    continued: true,
    width: labelWidth,
  });
  
  doc.text('2023-05-02', { align: "right"});
  doc.moveDown(0.7);
  
  // TRIP-DURATION
  doc.text('Trip duration:', {
    continued: true,
    width: labelWidth,
  });
  
  doc.text('5 days' , { align: "right"});
  doc.moveDown(0.7);
  
  // PERSON-COUNT
  doc.text('Person count:', {
    continued: true,
    width: labelWidth,
  });
  
  doc.text('1', { align: "right"});
  doc.moveDown(0.7);
  
  // MEANS OF TRANSPORT
  doc.text('Means of transport:', {
    continued: true,
    width: labelWidth,
  });
  
  doc.text('Plane + Car', { align: "right"});
  doc.moveDown(0.7);
  
  // VEHICLE TRAVEL DISTANCE
  doc.text('Vehicle travel distance:', {
    continued: true,
    width: labelWidth,
  });
  
  doc.text('120 km', { align: "right"});
  doc.moveDown(1.2);
  
  doc.moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .strokeColor('black')
    .stroke();
    doc.moveDown(1.2);
  
  
  
    // Kilometer Allowances Section
    doc.fontSize(13).text('Expenses', { underline: true });
    doc.moveDown();
    trip.otherExpenses.forEach((expense, index) => {
      doc.fontSize(11).text(`${expense.type}`, {
        continued: true,
        width: 150,
      });
      doc.text(`${expense.amount}`, { align: "right"});
      doc.moveDown(0.7);
    })
    // trip.kilometerAllowances.forEach((allowance, index) => {
    //     doc.moveDown(0.5).fontSize(12).text(`Allowance #${index + 1}`, { bold: true });
    //     doc.text(`Description: ${allowance.description}`);
    //     doc.text(`Vehicle: ${allowance.vehicleInfo}`);
    //     doc.text(`Route: ${allowance.route.join(' -> ')}`);
    //     doc.text(`Distance: ${allowance.distance} km`);
    //     doc.text(`Sum: €${allowance.sum}`);
    //     doc.text(`Start Date: ${new Date(allowance.startDate).toLocaleDateString()}`);
    //     doc.text(`End Date: ${new Date(allowance.endDate).toLocaleDateString()}`);
    //     doc.text(`Passengers: ${allowance.passengers}`);
    //     doc.text(`Passenger Names: ${allowance.passengerNames.join(', ')}`);
    //     doc.moveDown();
    // });
  
    // Daily Allowances Section
    // doc.fontSize(16).text('Daily Allowances:', { underline: true });
    // trip.dailyAllowances.forEach((allowance, index) => {
    //     doc.moveDown(0.5).fontSize(12).text(`Allowance #${index + 1}`, { bold: true });
    //     doc.text(`Description: ${allowance.description}`);
    //     doc.text(`Total Allowances: ${allowance.totalAllowances}`);
    //     doc.text(`Free Meals: ${allowance.freeMeals}`);
    //     doc.text(`Country: ${allowance.country}`);
    //     doc.text(`Over 5 km: ${allowance.over_5_km ? 'Yes' : 'No'}`);
    //     doc.text(`Over 15 km: ${allowance.over_15_km ? 'Yes' : 'No'}`);
    //     doc.text(`Traveling by Ship or Plane: ${allowance.travelingByShipOrPlane ? 'Yes' : 'No'}`);
    //     doc.text(`Start Date: ${new Date(allowance.startDate).toLocaleDateString()}`);
    //     doc.text(`End Date: ${new Date(allowance.endDate).toLocaleDateString()}`);
    //     doc.moveDown();
    // });
    doc.end();
}