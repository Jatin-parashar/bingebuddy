import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

const ContentDetailPage = () => {

  const location = useLocation();
  const params = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const path = `${import.meta.env.VITE_ENDPOINT}/${params.contentType}/${params.contentId}?api_key=${
    import.meta.env.VITE_API_KEY
  }`;

  useEffect(() => {
    const sendRequest = async () => {
      try {
        setLoading(true);
        const response = await axios.get(path);
        setData(response.data); 
        console.log(response.data);
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false); 
      }
    };

    sendRequest();
  }, [path]);



  return (
    <>
    {(loading || error) && (
      <div style={{ textAlign: "center", margin: "50px" }}>
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
      </div>
    )}
    
    <div>{path}</div>
  </>
  )
}

export default ContentDetailPage