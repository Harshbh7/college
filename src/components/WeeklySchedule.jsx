// src/components/AttendanceDashboard.jsx
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const AttendanceDashboard = () => {
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [todayDate, setTodayDate] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 425);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.toLocaleString("en-US", { month: "long" });
    const date = today.getDate();

    setTodayDate(`${date} ${month}, ${year}`);

    const BASE_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL;
    const studentApiUrl = `${BASE_URL}/student_list.json`;
    const attendanceApiUrl = `${BASE_URL}/attendance/${year}/${month}/${date}.json`;
    
    const fetchData = async () => {
      try {
        const studentResponse = await fetch(studentApiUrl);
        const studentData = await studentResponse.json();
        const studentList = studentData
          ? Object.keys(studentData).map((id) => ({
              id,
              name: studentData[id].name || "Unknown",
            }))
          : [];

        setStudents(studentList);

        const attendanceResponse = await fetch(attendanceApiUrl);
        const attendanceData = await attendanceResponse.json() || {};

        let presentCount = 0;
        const updatedBarChartData = studentList.map((student) => {
          const status = attendanceData[student.id]?.status || "Absent";
          if (status === "Present") presentCount++;

          return {
            name: student.name,
            Present: status === "Present" ? 1 : 0,
            Absent: status === "Absent" ? 1 : 0,
          };
        });

        const totalStudents = studentList.length;
        const absentCount = totalStudents - presentCount;

        setAttendanceData([
          { name: "Present", value: presentCount },
          { name: "Absent", value: absentCount },
        ]);

        setBarChartData(updatedBarChartData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // ✅ Listen for screen size changes
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 425);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const COLORS = ["#4CAF50", "#F44336"];

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Attendance Dashboard - {todayDate}</h2>

      {/* ✅ Dynamic Layout: Two charts in desktop, One in mobile */}
      <div style={isMobile ? styles.chartsMobile : styles.chartsDesktop}>
        {/* ✅ Bar Chart */}
        <div style={styles.chart}>
          <h3 style={styles.chartTitle}>Student Attendance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData} barSize={30}>
              <XAxis dataKey="name" angle={-45} textAnchor="end" fontSize={12} interval={0} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Legend wrapperStyle={{ marginTop: 10 }} /> {/* ✅ Added margin-top */}
              <Bar dataKey="Present" fill="#4CAF50" />
              <Bar dataKey="Absent" fill="#F44336" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ✅ Pie Chart */}
        <div style={styles.chart}>
          <h3 style={styles.chartTitle}>Attendance Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={attendanceData} dataKey="value" cx="50%" cy="50%" outerRadius="60%" label>
                {attendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ marginTop: 10 }} /> {/* ✅ Added margin-top */}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// ✅ Mobile-Responsive CSS-in-JS Styles
const styles = {
  container: {
    maxWidth: "1000px",
    margin: "auto",
    padding: "20px",
    textAlign: "center",
  },
  heading: {
    fontSize: "22px",
    marginBottom: "20px",
  },
  chartsDesktop: {
    display: "flex", // ✅ Side-by-side layout for desktop
    justifyContent: "space-between",
    gap: "20px",
  },
  chartsMobile: {
    display: "flex",
    flexDirection: "column", // ✅ Stacked layout for mobile
    gap: "20px",
  },
  chart: {
    width: "100%",
    maxWidth: "500px",
    margin: "auto",
    marginBottom: "20px",
  },
  chartTitle: {
    marginBottom: "10px",
    fontSize: "18px",
  },
};

export default AttendanceDashboard;
