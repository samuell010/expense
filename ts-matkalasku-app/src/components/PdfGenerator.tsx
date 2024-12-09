import React, { useEffect, useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import Modal from "./Modal";
import PdfModal from "./PdfModal";

// Create styles for the PDF layout
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
  },
  section: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottom: "1px solid gray",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  description: {
    fontSize: 11,
    marginBottom: 10,
  },
  explanation: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 10,
    fontWeight: "semibold",
  },
  text: {
    marginBottom: 10,
    paddingLeft: 2,
  },
  listItem: {
    marginLeft: 10,
    marginBottom: 4,
  },
  viewer: {
    width: "100%", // Full width for preview
    height: "85vh", // Adjust height as needed
  },
  button: {
    backgroundColor: "#1D4ED8",
    color: "white",
    padding: 8,
    borderRadius: 4,
    textAlign: "center",
    cursor: "pointer",
  },
  closeModalButton: {
    backgroundColor: "#E53E3E",
    color: "white",
    padding: 10,
    borderRadius: 4,
    textAlign: "center",
    cursor: "pointer",
    marginBottom: 10,
  },
  image: {
    width: "165px",
    height: "165px",
  },
});

const getImageUrl = async () => {
  try {
    // Fetch the presigned URL from your server
    const response = await fetch(
      "http://localhost:3005/api/url/whole-heart.png",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    // Check if the response is okay
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Parse the JSON response to get the URL
    const data = await response.json();

    // Use the URL (e.g., to display the image)
    return data.url;
  } catch (error) {
    console.error("Error fetching presigned URL:", error);
  }
};

interface KilometerAllowance {
  id: number;
  description: string;
  vehicleInfo: string;
  distance: number;
  totalCost: number;
  startDate: string;
  endDate: string;
  passengers: number;
  passengerNames: string[];
}

interface DailyAllowance {
  id: number;
  description: string;
  totalAllowances: number;
  freeMeals: number;
  country: string;
  over_5_km: boolean;
  over_15_km: boolean;
  travelingByShipOrPlane: boolean;
  startDate: string;
  endDate: string;
}

interface OtherExpense {
  id: number;
  type: string;
  date: string;
  amount: number;
  country: string;
  vat: number;
  sum: number;
  description: string;
  comment: string;
}

interface Report {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  kilometerAllowances: KilometerAllowance[];
  dailyAllowances: DailyAllowance[];
  otherExpenses: OtherExpense[];
}

interface x {
  imageURL: string[];
  data: Report;
}
// Define the PDF document component
const MyDocument = ({ imageUrls, data }: x) => (
  <Document>
    <Page style={styles.page}>
      {/* Trip Information */}
      <View style={styles.section}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.text}>
          Trip Duration: {new Date(data.startDate).toLocaleDateString()} -{" "}
          {new Date(data.endDate).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.explanation}>Explanation of the trip</Text>
        <Text style={styles.description}>{data.description}</Text>
      </View>

      {/* Kilometer Allowances */}
      {data.kilometerAllowances.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Kilometer Allowances:</Text>
          {data.kilometerAllowances.map((allowance, index) => (
            <View key={allowance.id} style={styles.listItem}>
              <Text style={styles.text}>
                Description: {allowance.description}
              </Text>
              <Text style={styles.text}>
                Vehicle Info: {allowance.vehicleInfo}
              </Text>
              <Text style={styles.text}>Distance: {allowance.distance} km</Text>
              <Text style={styles.text}>
                Passengers: {allowance.passengers} (Names:{" "}
                {allowance.passengerNames.join(", ")})
              </Text>
              <Text style={styles.text}>
                Total Cost: {allowance.totalCost} €
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Daily Allowances */}
      {data.dailyAllowances.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Daily Allowances:</Text>
          {data.dailyAllowances.map((allowance, index) => (
            <View key={allowance.id} style={styles.listItem}>
              <Text style={styles.text}>
                Description: {allowance.description}
              </Text>
              <Text style={styles.text}>Country: {allowance.country}</Text>
              <Text style={styles.text}>Free Meals: {allowance.freeMeals}</Text>
              <Text style={styles.text}>
                Total Allowances: {allowance.totalAllowances} €
              </Text>
              <Text style={styles.text}>
                Over 5 km: {allowance.over_5_km ? "Yes" : "No"}
              </Text>
              <Text style={styles.text}>
                Over 15 km: {allowance.over_15_km ? "Yes" : "No"}
              </Text>
              <Text style={styles.text}>
                Traveling by Ship or Plane:{" "}
                {allowance.travelingByShipOrPlane ? "Yes" : "No"}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Other Expenses */}
      {data.otherExpenses.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Other Expenses:</Text>
          {data.otherExpenses.map((expense, index) => (
            <View key={expense.id} style={styles.listItem}>
              <Text style={styles.text}>Type: {expense.type}</Text>
              <Text style={styles.text}>
                Description: {expense.description}
              </Text>
              <Text style={styles.text}>Amount: {expense.amount} €</Text>
              <Text style={styles.text}>VAT: {expense.vat} %</Text>
              <Text style={styles.text}>Sum: {expense.sum} €</Text>
              <Text style={styles.text}>Comment: {expense.comment}</Text>
            </View>
          ))}
        </View>
      )}

    
      {/* Summary */}
      <View style={styles.section}>
        <Text style={styles.text}>
          Total Expenses: {/* Calculate the total sum */}
          {[
            ...data.kilometerAllowances.map((km) => km.totalCost),
            ...data.dailyAllowances.map((da) => da.totalAllowances),
            ...data.otherExpenses.map((oe) => oe.sum),
          ]
            .reduce((total, value) => total + value, 0)
            .toFixed(2)}
          €{/* Total Expenses */}
        </Text>
      </View>

      <View>
        <Text style={styles.text}>
          Attachments:
        </Text>
      </View>


      {/* Image Section */}
         {/* Image Section */}
         <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap" }}>
        {imageUrls.length > 0 ? (
          imageUrls.map((url, index) => 
            url ? <Image key={index} src={url} style={styles.image} /> : null // Only render if URL is valid
          )
        ) : (
          <Text>No Images Available</Text>
        )}
      </View>
    </Page>
  </Document>
);

const PdfGenerator = ({ data }) => {
  // State to toggle the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
 

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const imageUrls = data.otherExpenses.flatMap((expense) =>
    expense.attachments.map((att) => att.url),
  );

  return (
    <div>
      {/* Button to open the PDF preview modal */}
      <button
        className="flex items-center gap-2 button-add"
        onClick={handleOpenModal}
      >
        <span>&#x1F4E5;</span> {/* Upload icon */}
        Upload
      </button>

      {/* PDF Preview Modal */}
      {isModalOpen && (
        <PdfModal onClose={handleCloseModal}>
          <PDFViewer style={styles.viewer}>
            <MyDocument data={data} imageUrls={imageUrls || ""} />
          </PDFViewer>
        </PdfModal>
      )}
      {/* Download PDF Link */}
      {/* <PDFDownloadLink document={<MyDocument data={data} imageURL={img || ''} />} fileName="report.pdf">
        {({ loading }) => (loading ? "Loading document..." : "Download PDF")}
      </PDFDownloadLink> */}
    </div>
  );
};

export default PdfGenerator;
