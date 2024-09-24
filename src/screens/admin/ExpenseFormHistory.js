import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchExpenseFormHistory } from "../../services/ExpenseFormHistoryService";
import '../../styles/ExpenseFormHistory.css';
import Navbar from "../../components/Navbar";
import { USERROLE } from "../../config/Constants";

const ExpenseFormHistory = () => {
  const { id } = useParams();
  const [history, setHistory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchExpenseFormHistory(id);
        setHistory(response);
      } catch (error) {
        console.error("Failed to fetch expense form history:", error);
      }
    };

    fetchData();
  }, [id]);



  // Tarih ve saat formatlayan fonksiyon
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString('tr-TR');  // Tarihi formatla
    const formattedTime = date.toLocaleTimeString('tr-TR');  // Saati formatla
    return `${formattedDate} ${formattedTime}`;  // Tarih ve saati birleştir
  };

  return (
    <div>
        <Navbar userRole={USERROLE[3]} />
        <div className="history-page">
      
      <div className="history-container">
        <h2 className="history-title">Expense Form History</h2>
        {history ? (
          history.result.map((item) => (
            <div key={item.id} className={`history-item action-${item.action.toLowerCase()}`}>
              <div className="history-content">
                <p><strong>Action:</strong> <span>{item.action}</span></p>
                <p><strong>Date:</strong> <span>{formatDateTime(item.date)}</span></p> 
                <p><strong>User ID:</strong> <span>{item.madeBy}</span></p>
                <p><strong>Full Name:</strong> <span>{item.fullName}</span></p>
              </div>
            </div>
          ))
        ) : (
          <p className="loading">Loading...</p>
        )}
      </div>
    </div>
    </div>
    
  );
};

export default ExpenseFormHistory;
