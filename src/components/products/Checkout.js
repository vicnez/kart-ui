import React, { useState, useEffect } from 'react'
import Header from '../common/Header';
import Modal from '../common/Modal';
import {getUser} from '../../utils/Common';
import axios from 'axios';
import '../../css/pdp.css';
import { useNavigate } from 'react-router-dom';
var TEMP_CSS_PAY_UI = '';
const Checkout = () => {
    let navigate = useNavigate();
    const form_valid_initial_values = { customer_delivery_address_id: "", order_summary_exists: false, payment_proceed_id: "" };
    const [formValues, setFormValues] = useState(form_valid_initial_values);
    const [formErrors, setFormErrors] = useState({});

    const [checkout_product_details, setCheckoutProductDetails] = useState([]);
    const [checkout_product_price_details, setCheckoutProductPriceDetails] = useState([]);
    const [checkout_delivery_address_details, setCheckoutDeliveryAddressDetails] = useState([]);
    const [checkout_customer_card_details, setCheckoutCustomerCardDetails] = useState([]);
    const [checkoutprodloading, setCheckoutProdLoading] = useState(false);
    const [checkout_product_cust_addr, setCheckoutProdCustAddr] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMsgBox, setModalMsgBox] = useState(false);
    console.log(getUser());
    
    useEffect(() => {

        const getCheckoutProductDetails = async () => {
            setCheckoutProdLoading(false);
            await axios.get("http://localhost:8001/api/order/summary",{
                params: {
                    user_id: getUser().user_id
                }})
            .then(checkout_prod_response => {
                console.log(checkout_prod_response);
                if(checkout_prod_response.data.status === "success"){
    
                    const prodinfo = checkout_prod_response.data.result.result;
                    const prodpriceinfo = checkout_prod_response.data.result.price_details;
                    if(!! prodinfo){
                        console.log(prodinfo);
                        setCheckoutProductDetails(prodinfo);
                        setCheckoutProductPriceDetails(prodpriceinfo);
                        setCheckoutProdLoading(true);
                        setFormValues({ ...formValues, ["order_summary_exists"]: true });
                    }
                    
                }else{
                  
                  document.querySelector('.checkout_ui').style.display = 'none';
                  setModalOpen(true);
                }
                setCheckoutProdLoading(false);
            })
            .catch(err => {
                console.log(err);
            })
        }
        
        getCheckoutProductDetails();    

        //BEGIN : Get Delivery Address 
        const getCheckoutDeliveryAddressDetails = async () => {
          setCheckoutProdLoading(false);
            await axios.get("http://localhost:8001/api/user/address/list",{
                params: {
                    user_id: getUser().user_id
                }})
            .then(checkout_delivery_addr_response => {
                console.log(checkout_delivery_addr_response);
                if(checkout_delivery_addr_response.data.status === "success"){
    
                    const delivery_address_info = checkout_delivery_addr_response.data.result.result;
                    if(!! delivery_address_info){
                        console.log(delivery_address_info);
                        setCheckoutDeliveryAddressDetails(delivery_address_info);
                        setCheckoutProdLoading(true);
                    }
                    
                }
                setCheckoutProdLoading(false);
            })
            .catch(err => {
                console.log(err);
            })
        }

        getCheckoutDeliveryAddressDetails();
      //END : Get Delivery Address 
      
      //BEGIN : Get Customer Card Infos  
      const getCheckoutCustomerCardDetails = async () => {
        setCheckoutProdLoading(false);
          await axios.get("http://localhost:8001/api/stripe/customers-cards-info",{
              params: {
                  user_id: getUser().user_id
              }})
          .then(checkout_cust_card_response => {
              console.log(checkout_cust_card_response);
              if(checkout_cust_card_response.data.status === "success"){
  
                  const cust_card_info = checkout_cust_card_response.data.result.result;
                  if(!! cust_card_info){
                      console.log(cust_card_info);
                      setCheckoutCustomerCardDetails(cust_card_info);
                      setCheckoutProdLoading(true);
                  }
                  
              }
              setCheckoutProdLoading(false);
          })
          .catch(err => {
              console.log(err);
          })
      }

      getCheckoutCustomerCardDetails();
    //END : Get Customer Card Infos 
    
    
    },[]);

    

    const login_info_sec = () => {
      //window.document.getElementById("login_info_sec").style.display = "none";
    }
    
    const cartProductDelete = async (e) => {

       e.preventDefault();

       setModalOpen(true);
       

    }

    //BEGIN : PAYMENT
    const PaymentOptionProceed = async (card_id, cust_id) => {
      console.log("card_id :"+card_id+" - cust_id :"+cust_id);

      setFormErrors(vallidateForm(formValues));

      if(checkout_product_cust_addr == "" || checkout_product_cust_addr == 'undefined' || checkout_product_cust_addr == null){
        console.log("ddddd", checkout_product_cust_addr);
      }else{
        console.log("ddddd22222", checkout_product_cust_addr);
      }

      return false;

      // document.querySelector('#checkoutsec1').style.display = 'none';
      // document.querySelector('#checkoutsec2').style.display = 'none';
      // document.querySelector('#checkoutsec3').style.display = 'block';


      await axios.post("http://localhost:8001/api/order/payment",
      {
        "user_id": getUser().user_id,
        "card": card_id,
        "customer_id": cust_id,
        "customer_address_id": checkout_product_cust_addr
      
      })
      .then(pay_response => {

        console.log(pay_response);

        if(pay_response.data.status === "success"){
  
          const pay_response_info = pay_response.data.result;
          if(!! pay_response_info){
              console.log(pay_response_info);
              document.querySelector('#checkoutsec1').style.display = 'none';
              document.querySelector('#checkoutsec2').style.display = 'none';
              document.querySelector('#checkoutsec3').style.display = 'block';
              document.getElementById("alert_div").innerHTML += " <div className='alert alert-success'><strong>Success!</strong> &nbsp; "+pay_response.data.message+"</div><div style='padding-top: 20px;'><a href='/'> <button  type='button' className='btn btn-secondary'>Continue Shop </button></a></div>";
              
              setCheckoutProdLoading(true);
          }
          
      }else{
        window.setTimeout(() => {
          document.querySelector('#checkoutsec3').style.display = 'block';
          document.getElementById("alert_div").innerHTML += "<div className='alert alert-info'><strong>Info!</strong>"+pay_response.data.message+"</div>";
        }, 2000);
      }
      
      setCheckoutProdLoading(false);

      })
      .catch(err => {
        console.log(err);
      });
    }
    //END : PAYMENT

    const handlePayOptionEnable = (event) => {
      //console.log();

      if(TEMP_CSS_PAY_UI !='' && TEMP_CSS_PAY_UI != 'undefined'){
        document.querySelector('#pay_'+TEMP_CSS_PAY_UI).style.display = 'none';
      }
      var payoptenable = event.target.value
      TEMP_CSS_PAY_UI = payoptenable;
      setFormValues({ ...formValues, ["payment_proceed_id"]: payoptenable });
      document.querySelector('#pay_'+payoptenable).style.display = 'block';
    }

    const handleCustomerAddressSet = (event) => {
        const cust_address_id = event.target.value;
        console.log("cust_address_id : ", cust_address_id);
        setFormValues({ ...formValues, ["customer_delivery_address_id"]: cust_address_id });
        setCheckoutProdCustAddr(cust_address_id);
        console.log(formValues);
    }

    const vallidateForm = (values) => {
      const errors = {};


      if(!getUser().user_id){
        errors.login = "Pls login you didn't logged in";
      }

      if(!values.customer_delivery_address_id){
        errors.delivery_address = "Please choose delivery option, It shouldn't be empty/unselect";

      }

      if(!values.order_summary_exists){
        errors.order_summary = "No product in your cart";
      }

      if(!values.payment_proceed_id){
        errors.payment = "No payment options selected, Please select pay oprion";
      }

      return errors;
    }
    
  return (
    <div className="App">
        <Header />
        
        
        <div className="container  bg-white mt-5 mb-5" key="" style={{marginBottom:"10px"}}>

        <pre>{JSON.stringify(formValues, undefined, 2)}</pre>
        <pre>{JSON.stringify(formErrors, undefined, 2)}</pre>
        {modalOpen && <Modal setOpenModal={setModalOpen} />}
        <div className="row checkout_ui" style={{paddingTop: "35px", paddingBottom: "35px"}}>
        
            {/* 12 - 8 - 4 */}
            <div className='col-md-8' id="checkoutsec1">
                {/* code set collapse */}
                <div id="accordion">
                  <div className="card">
                    <div className="card-header">
                      <a className="card-link" data-toggle="collapse" href="#loginCollapse">
                        <span style={{color:"#878787"}}><b>LOGIN</b></span>
                        <span id="login_info_sec" onClick={login_info_sec}><button style={{float: "right", color: "#2874f0"}}>CHANGE</button></span>
                      </a>
                    </div>
                    <div id="loginCollapse" className="collapse " data-parent="#accordion">
                      <div className="card-body">

                       <div className="row" style={{paddingBottom:"5px"}}>
                
                          <div className='col-md-6 ' style={{float:"left"}}>
                          <div style={{padding: "10px"}}> <span style={{color:"#878787"}}>Name</span> <b>{getUser().first_name}</b> </div>
                          <div style={{padding: "10px"}}><a href='/logout'>Logout & Sign in to another account</a></div>
                          <div style={{padding: "10px"}} ><button style={{background: "#fb641b"}} data-toggle="collapse" href="#loginCollapse"> CONTINUE CHECKOUT</button></div>
                          
                          </div>

                          <div className='col-md-6'>

                          </div>
                      </div>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header">
                      <a className="collapsed card-link" data-toggle="collapse" href="#DeliveryInfoCollapse">
                      <span style={{color:"#878787"}}><b>DELIVERY ADDRESS</b></span> 
                      <span id="delivery_address_sec"><button style={{float: "right", color: "#2874f0"}}>CHANGE</button></span>
                      </a>
                    </div>
                    <div id="DeliveryInfoCollapse" className="collapse show" data-parent="#accordion">
                      <div className="card-body">
                          {/* List address data begin */}
                          <span>{formErrors.delivery_address}</span>
                          { ! checkoutprodloading && checkout_delivery_address_details.map(delivery_addr_detail =>
                          <div className="row" style={{paddingBottom:"5px",paddingTop:"20px"}} >
                          
                          <div className='col-md-10' style={{float:"left"}}>
                          

                          <div className="custom-control custom-radio">
                            <input type="radio" className="custom-control-input" id={"customer_delivery_address_id_"+delivery_addr_detail._id} value={delivery_addr_detail._id} name="customer_delivery_address_id" onChange={handleCustomerAddressSet}/>
                            <label className="custom-control-label" for={"customer_delivery_address_id_"+delivery_addr_detail._id}><b>{delivery_addr_detail.name+" "} &nbsp; &nbsp; <i className="fa fa-phone"></i> {delivery_addr_detail.mobile} </b> <br/>
                            {delivery_addr_detail.address_line1+", "} {delivery_addr_detail.address_line2+", "} {delivery_addr_detail.city} - 
                            <b>&nbsp; {delivery_addr_detail.postal_code}</b></label>
                          </div> 

                          <hr/>
                          </div>

                          <div className='col-md-2'>


                          </div>
                          
                          </div>  
                          )}
                          {/* list address data data end */}
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header">
                      <a className="collapsed card-link" data-toggle="collapse" href="#OrderSummaryCollapse">
                      <span style={{color:"#878787"}}><b>ORDER SUMMARY</b></span>
                      <span id="order_summary_sec"><button style={{float: "right", color: "#2874f0"}}>CHANGE</button></span>
                      </a>
                    </div>
                    <div id="OrderSummaryCollapse" className="collapse" data-parent="#accordion">
                      <div className="card-body">
                        {/* List item data begin */}
                        <span>{formErrors.order_summary}</span>
                 {/* Item 1 */}
                 { ! checkoutprodloading && checkout_product_details.map(cartproductdetail =>
                <div className="row" style={{paddingBottom:"5px"}}>
                
                <div className='col-md-4 item-photo' style={{float:"left"}}>
                
                <img style={{maxWidth: "50%", height: "200px"}} src={`http://localhost:8001/products/${cartproductdetail.products.product_image_name}`} alt=""/>

                
                </div>

                <div className='col-md-8'>

                 <div> <span>&nbsp;<strong> {cartproductdetail.products.model_no} ({cartproductdetail.products.color}, {cartproductdetail.products.storage}) </strong></span> </div> 

                 <div> <span>&nbsp;  {cartproductdetail.products.ram} RAM </span> </div>

                 {/* <div> <span>&nbsp; &#8377;  { Number(cartproductdetail.products.price)  } </span> </div> */}
                 <div> <span>&nbsp; &#8377; { Number(cartproductdetail.products.price) - Math.round((Number(cartproductdetail.products.price) / 100) * Number(cartproductdetail.product_discount.discount_percentage)) }</span>&nbsp;<span className="price_line_strikeout">&#8377;  {cartproductdetail.products.price} </span> <span className="fnt-12">&nbsp;({Number(cartproductdetail.product_discount.discount_percentage)} % off)</span> </div> 
                 <div style={{paddingTop:"20px"}}><span style={{fontSize:"14px", cursor:"pointer"}} onClick={(e) => cartProductDelete(e)}> &nbsp;<i className="fa fa-trash-o"></i> Remove</span></div>
                </div>
                
                </div>
                )}
                


                 {/* list item data end */}
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <a className="card-link" data-toggle="collapse" href="#paymentCollapse">
                        <span style={{color:"#878787"}}><b>PAYMENT</b></span>
                      
                      </a>
                    </div>
                    <div id="paymentCollapse" className="collapse " data-parent="#accordion">
                      <div className="card-body">
                      <span>{formErrors.payment_proceed_id}</span>
                
                       { ! checkoutprodloading && checkout_customer_card_details.map(cust_card_detail =>
                          <div className="row" style={{paddingBottom:"5px"}} key={"ccid_"+cust_card_detail._id}>
                          
                          <div className='col-md-12' style={{float:"left"}}>
                          

                          <div className="custom-control custom-radio">
                            <input type="radio" className="custom-control-input" id={"user_cust_card_"+cust_card_detail._id} value={cust_card_detail._id} name="payment_id" onChange={handlePayOptionEnable}/>
                            <label className="custom-control-label" for={"user_cust_card_"+cust_card_detail._id}><b>{cust_card_detail.customersinfo.customer_name+"'s Card"} &nbsp; &nbsp; </b> <br/> <button onClick={(e) => PaymentOptionProceed(cust_card_detail.customer_card_id, cust_card_detail.customersinfo.customer_id)} id={"pay_"+cust_card_detail._id} className="payall" style={{marginTop:"15px",display:"none"}}>PAY &nbsp; &#8377; {Math.round(checkout_product_price_details.total_price)}</button><br/>
                            
                            </label>
                            
                          </div> 
                          
                          <hr/>
                          </div>

                          
                          <br/>
                          </div>  
                          )}
                      
                      </div>
                    </div>
                    
                  </div>
                </div>
            </div>   

            {/* 12 - 8 - 4 */}

                {/* 12 - 8 - 4 -2 */}
                { ! checkoutprodloading && checkout_product_price_details ?(
                <div className="col-md-4" id="checkoutsec2" style={{border:"0px solid gray", paddingLeft: "100px", width: "50%"}}>
                    
                    <div className=''>
                    <span style={{color:"#878787"}}><b>PRICE DETAILS</b></span>
                    <hr></hr>
                    <div className=''>
                        <div className='price'>
                        <span>Price ({checkout_product_price_details.quantities} {checkout_product_price_details.quantities > 1 ?("Items"): "Item"}) &nbsp; &nbsp; &nbsp; &#8377; {Math.round(checkout_product_price_details.price)}</span>
                        </div>

                        <div className='discount'>
                        <span>Discount  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; - &#8377; {Math.round(checkout_product_price_details.discount)}</span>
                        </div>
                       
                    </div>
                    <hr></hr>
                    <div className='tot_amt'>
                    <span><b>Total Amount &nbsp; &nbsp; &nbsp; &#8377; {Math.round(checkout_product_price_details.total_price)} </b></span>
                        
                    </div>
                    </div>    
        
                                                         
                </div> ):"" }   
                                         

            {/* 12 - 8 - 4-2 */}
            
            <div className="row col-md-12" id="checkoutsec3" style={{paddingTop: "35px", paddingLeft: "35px", paddingBottom: "35px"}}>
            <div className="" id="alert_div" style={{paddingTop:"20px", paddingLeft:"300px"}}>
           
            </div> 
            </div>
            
            </div>

        </div> 
    </div>
  )
}

export default Checkout
