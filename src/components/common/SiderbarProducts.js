import React, {useState, useEffect} from 'react'
import '../../css/sidebar.css';
import axios from 'axios';
const SiderbarProducts = () => {

  const mobile_brands = [
    {
      "id": 1,
      "name": "Realme"
    },
    {
      "id": 2,
      "name": "OnePlus"
    },
    {
      "id": 3,
      "name": "SAMSUNG"
    },
    {
      "id": 4,
      "name": "Apple"
    },
    {
      "id": 5,
      "name": "Infinix"
    },
    {
      "id": 6,
      "name": "Motorola"
    },
    {
      "id": 7,
      "name": "BlackBerry"
    },
    {
      "id": 8,
      "name": "Oppo"
    },
    {
      "id": 9,
      "name": "Google"
    },
    {
      "id": 10,
      "name": "vivo"
    },
    {
      "id": 11,
      "name": "Nokia"
    }
  ];

  const handleOnChange = (e) => {
    console.log(e.target.value);
  };

  return (
    <div className="sidebar">
      <div className='container'>
        <div style={{width: '150px', height: '110px', overflow: 'scroll;'}}>
          {/* BRANDS */}
          <div className="brands_cb">
          <span><strong>Brands</strong></span>

          { mobile_brands.map(mb => 
          <div className="form-check">
            <label className="form-check-label" for={mb.name}>
              <input type="checkbox" className="form-check-input" id={mb.name} name="brand" value={mb.name} onChange={handleOnChange} />{mb.name}
            </label>
          </div>
          )}
        </div>
        {/* BRANDS */}
        <hr></hr>
        {/* PRICE */}
        <div className="price_rb">
        <span><strong>Price</strong></span>
          <div className="form-check">
            <label className="form-check-label" for="radio1">
              <input type="radio" className="form-check-input" id="radio1" name="optradio" value="option1" />Under ₹1,000
            </label>
          </div>
          <div className="form-check">
            <label className="form-check-label" for="radio2">
              <input type="radio" className="form-check-input" id="radio2" name="optradio" value="option2" />₹1,000 - ₹5,000
            </label>
          </div>
          <div className="form-check">
            <label className="form-check-label">
              <input type="radio" className="form-check-input" />₹5,000 - ₹10,000
            </label>
          </div>
          <div className="form-check">
            <label className="form-check-label">
              <input type="radio" className="form-check-input" />₹10,000 - ₹20,000
            </label>
          </div>
          <div className="form-check">
            <label className="form-check-label">
              <input type="radio" className="form-check-input" /> Over ₹20,000
            </label>
          </div>
         
        </div>
        {/* PRICE */}
        <hr></hr>
          {/* DISCOUNT */}
          <div className="discounts_cb">
          <span><strong>Discounts</strong></span>
          <div className="form-check">
            <label className="form-check-label" for="check1">
              <input type="checkbox" className="form-check-input" id="check1" name="option1" value="something" />10% Off or more
            </label>
          </div>
        <div className="form-check">
          <label className="form-check-label" for="check2">
            <input type="checkbox" className="form-check-input" id="check2" name="option2" value="something" />25% Off or more
          </label>
        </div>
        <div className="form-check">
          <label className="form-check-label">
            <input type="checkbox" className="form-check-input" />35% Off or more
          </label>
        </div>
        <div className="form-check">
          <label className="form-check-label">
            <input type="checkbox" className="form-check-input" />50% Off or more
          </label>
        </div>
        </div>
        {/* DISCOUNT */}
        </div>
      </div>    

	</div>
  )
}

export default SiderbarProducts
