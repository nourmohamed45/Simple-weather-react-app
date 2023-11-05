import "./App.css";

// React
import { useEffect, useState } from "react";

// External Libraries
import axios from "axios";
import moment from "moment";
import "moment/min/locales";
import { useTranslation } from 'react-i18next';

// MaterialUi
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material";
import Typography from "@mui/material/Typography";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";



moment.locale("ar");

// Declaration Theme
const theme = createTheme({
  typography: {
    fontFamily: ["IBM"],
    h2: {
      fontWeight: 700, // Set the font weight for "h2" variant
    },
  },
});



let cancelAxios = null;

function App() {
  const { t, i18n } = useTranslation();

  // ======================= States =======================
  const [dateAndTime, setDateAndTime] = useState(null);
  const [temp, setTemp] = useState({
    number: null,
    description: "",
    min: null,
    max: null,
    icon: null,
  })
  const [locale, setLocale] = useState("ar")
  const [dir, setDir] = useState("rtl")


  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [])



  useEffect(() => {

    // Create an interval to update the time every second
    const intervalId = setInterval(() => {
      setDateAndTime(moment().format('MMMM Do YYYY, h:mm:ss a'));
    }, 1000);

    // Cleanup the interval when the component unmounts

    axios
      .get("https://api.openweathermap.org/data/2.5/weather?lat=24.77&lon=46.73&appid=c4f5ed971fda0325128a71653dd941b3",
      {
        cancelToken: new axios.CancelToken((c) => {
          cancelAxios = c;
        })
      }
      )
      .then(function (response) {
        // handle success
        const responseTemp = Math.round(response.data.main.temp - 272.15)
        const min = Math.round(response.data.main.temp_min - 272.15)
        const max = Math.round(response.data.main.temp_max - 272.15)
        const desc = response.data.weather[0].description;
        const imgUrl = response.data.weather[0].icon;
        const icon = `https://openweathermap.org/img/wn/${imgUrl}@2x.png`
        setTemp({number: responseTemp, min: min, max: max, description: desc, icon: icon})
      })
      .catch(function (error) {
        // handle error
        Error("Error: " + error)
      });


    return () => {
      cancelAxios();
      clearInterval(intervalId)
    }

  }, []);

// ======================= Event handlers =======================
  function handleLanguageClick() {
    if(locale === "ar") {
      setLocale("en");
      i18n.changeLanguage("en")
      setDir("ltr")
    } else if(locale === "en") {
      setLocale("ar");
      i18n.changeLanguage("ar")
      setDir("rtl")
    }

  }


  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        {/* Card */}
        <div
          style={{
            dir: dir,
            background: "rgb(28 52 91 / 36%)",
            padding: "16px 32px",
            borderRadius: "15px",
            boxShadow: "0 11px 1px rgba(0,0,0,.05)",
          }}
        >
          {/* Content */}
          <div>
            {/* City & Time */}
            <div
              style={{
                display: "flex",
                alignItems: "end",
                justifyContent: "space-between",
                marginBottom: "20px",

              }}
              dir= {dir}
            >
              <Typography
                style={{ fontWeight: "500", fontSize: "56px" }}
                variant="div"
              >
                {t("Riyadh")}
              </Typography>

              <Typography style={{ width: "250px", textAlign: "end" }} variant="h5">
                {dateAndTime}
              </Typography>
            </div>
            {/* End City & Time */}
            <hr />
            {/* Container Of Degree + Cloud Icon */}
            <div className="container-degree-icon" style={{ display: "flex", justifyContent: "space-between", direction: dir }}>
              <div>
                <CloudIcon style={{ fontSize: "200px", color: "white" }} />
              </div>
              {/* Degree & Description */}
              <div>
                {/* Temp */}
                <div style={{display:"flex", flexDirection: "column", justifyContent:"space-between", alignItems: "end"}}>
                  <Typography
                    style={{
                      fontWeight: 400,
                      fontSize: "64px",
                      display: "flex",
                      justifyContent: "right",
                    }}
                    variant="div"
                  >
                    <img src={temp.icon}/>
                    {temp.number}c
                  </Typography>
                  {/* ToDo: Temp Img */}
                  {/* End Temp Img */}
                  <Typography
                    style={{
                      fontWeight: 400,
                      fontSize: "24px",
                      display: "flex",
                      justifyContent: "right",
                    }}
                    variant="div"
                  >
                    {t(temp.description)}
                  </Typography>
                  {/* Min & Max Temp */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "right",
                      fontSize: "24px",
                      marginTop: "16px",
                    }}
                  >
                    <h5>{t("Maximum")}: {temp.min}</h5>
                    <h5 className="separate-sign">|</h5>
                    <h5> {t("Minimum")}: {temp.max}</h5>
                  </div>
                  {/* End Min & Max Temp */}
                </div>
                {/* End Temp */}
              </div>
              {/* End Degree & Description */}
            </div>
            {/* End Container Of Degree + Cloud Icon */}
          </div>
          {/* End Content */}
        </div>
        {/* End Card */}
        <Button
          style={{
            color: "white",
            fontWeight: "500",
            fontSize: "20px",
            display: "flex",
            outline: "none",
            marginTop: "10px",
          }}
          variant="text"
          onClick={handleLanguageClick}
        >
          {t("English")}
        </Button>
      </Container>
    </ThemeProvider>
  );
}

export default App;
