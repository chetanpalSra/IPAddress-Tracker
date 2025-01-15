import React, { useState } from 'react'
import Map from './Map'

function Navbar() {
    const [ipAddress,setIpAddress] = useState('')
    const [ipDetails,setIpDetails] = useState({});
 
    const handleSearch = async(e)=>{
        e.preventDefault();
        if(ipAddress === '') return;
        try{ 
          const response = await fetch(`http://api.ipapi.com/api/${ipAddress}?access_key=f992aaf5381896f6adc58ed5dc4a2df6`);
          ; 
            const data = await response.json();

            console.log(data);

            setIpDetails(data);

        }catch(error){
            console.log('Cannot fetch ip details.Error:',error);
        }
    }

  return (
    <>
    <div className='container' style={{height: '0vh'}}>
    <nav className="navbar navbar-expand-lg  navbar-dark  bg-dark" style={{width: '50%',margin: 'auto',zIndex: '1',padding: '10px'}}>
    <div className="container-fluid">
      <a className="navbar-brand" href="/">Ip-Address</a>  
        <form className="d-flex" role="search">
          <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" name="ip" onChange={(e)=>{setIpAddress(e.target.value)}}/>
          <button className="btn btn-outline-success" type="submit" onClick={handleSearch}>Search</button>
        </form>
    </div>
  </nav>
    </div>
  
  <Map ipDetails={ipDetails}/>
  </>
   
  
  )
}

export default Navbar
