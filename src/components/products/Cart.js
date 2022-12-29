import React, { useState, useEffect } from 'react'
import Header from '../common/Header';
import {getUser} from '../../utils/Common';
import axios from 'axios';
import '../../css/pdp.css';
import { useNavigate } from 'react-router-dom';
const Cart = () => {
    let navigate = useNavigate();
    const [cart_product_details, setCartProductDetails] = useState([]);
    const [cart_product_price_details, setCartProductPriceDetails] = useState([]);
    const [cartprodloading, setCartProdLoading] = useState(false);

    useEffect(() => {
        
        getCartProductDetails();    
        
    },[]);

    const getCartProductDetails = async () => {
        setCartProdLoading(false);
        await axios.get("http://localhost:8001/api/order/summary",{
            params: {
                user_id: getUser().user_id
            }})
        .then(cart_prod_response => {
            console.log(cart_prod_response);
            if(cart_prod_response.data.status === "success"){

                const prodinfo = cart_prod_response.data.result.result;
                const prodpriceinfo = cart_prod_response.data.result.price_details;
                if(!! prodinfo){
                    console.log(prodinfo);
                    setCartProductDetails(prodinfo);
                    setCartProductPriceDetails(prodpriceinfo);
                    setCartProdLoading(true);
                }
                
            }else if(cart_prod_response.data.status === "no_record"){
                setCartProductDetails([]);
                setCartProductPriceDetails([]);
            }
            
            setCartProdLoading(false);
        })
        .catch(err => {
            console.log(err);
        })
    }


    const cartProductDelete = async (cart_id) => {

       
        await axios.delete("http://localhost:8001/api/cart/delete",{
            data: {
                user_id: getUser().user_id,
                cart_id: cart_id
            }
            
        }).then(cart_delete_response => {

            if(cart_delete_response.data.status === "success"){
                
                window.setTimeout(() => {
                    alert(cart_delete_response.data.message);
                    getCartProductDetails();
                }, 3000);

                
            }
            
        }).catch(err => {
            console.log(err)
        })

    }

    
  return (
    <div className="App">
        <Header />
        
        
        <div className="container  bg-white mt-5 mb-5" key="">

        <div className="row" style={{paddingTop: "35px"}}>
            {/* 12 - 8 - 4 */}
               <div className="col-md-8 " style={{padding: "30px", paddingBottom: "35px"}}>

                 {/* List item data begin */}
                 {/* Item 1 */}
                 { ! cartprodloading && cart_product_details.map(cartproductdetail =>
                <div className="row" style={{paddingBottom:"5px"}}>
                
                <div className='col-md-4 item-photo' style={{float:"left"}}>
                
                <img style={{maxWidth: "50%", height: "200px"}} src={`http://localhost:8001/products/${cartproductdetail.products.product_image_name}`} alt=""/>

                
                </div>

                <div className='col-md-8'>

                 <div> <span>&nbsp;<strong> {cartproductdetail.products.model_no} ({cartproductdetail.products.color}, {cartproductdetail.products.storage}) </strong></span> </div> 

                 <div> <span>&nbsp;  {cartproductdetail.products.ram} RAM </span> </div>

                 {/* <div> <span>&nbsp; &#8377;  { Number(cartproductdetail.products.price)  } </span> </div> */}
                 <div> <span>&nbsp; &#8377; { Number(cartproductdetail.products.price) - Math.round((Number(cartproductdetail.products.price) / 100) * Number(cartproductdetail.product_discount.discount_percentage)) }</span>&nbsp;<span className="price_line_strikeout">&#8377;  {cartproductdetail.products.price} </span> <span className="fnt-12">&nbsp;({Number(cartproductdetail.product_discount.discount_percentage)} % off)</span> </div> 
                 <div style={{paddingTop:"20px"}}><span style={{fontSize:"14px", cursor:"pointer"}} onClick={(e) => cartProductDelete(cartproductdetail._id)}> &nbsp;<i class="fa fa-trash-o"></i> Remove</span></div>
                </div>
               
                </div>  
                )}
                


                 {/* list item data end */}
                 { cart_product_details.length > 0 ?(
                <div className="" style={{ float:"right"}}>
                <a href='/checkout'> <button type="button" class="btn btn-secondary">PLACE ORDER</button></a>
                </div>):(<div className="row" style={{padding:"20px", marginLeft:"350px"}}><div className="col-md-2"></div><div className="col-md-8"> <div><span>Your cart is empty! <br/></span></div> <div><span>Add items to it now.<br/></span></div> <a href='/'> <button  type="button" class="btn btn-secondary">Shop now</button></a></div><div className="col-md-2"></div></div>)}

                </div>

                
                { ! cartprodloading && cart_product_price_details !=="" ?(
                <div className="col-md-4" style={{border:"0px solid gray", paddingLeft: "100px", width: "50%"}}>
                    
                    <div className=''>
                    <span style={{color:"#878787"}}><b>PRICE DETAILS</b></span>
                    <hr></hr>
                    <div className=''>
                        <div className='price'>
                        <span>Price ({cart_product_price_details.quantities} {cart_product_price_details.quantities > 1 ?("Items"): "Item"}) &nbsp; &nbsp; &nbsp; &#8377; {Math.round(cart_product_price_details.price)}</span>
                        </div>

                        <div className='discount'>
                        <span>Discount  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; - &#8377; {Math.round(cart_product_price_details.discount)}</span>
                        </div>
                       
                    </div>
                    <hr></hr>
                    <div className='tot_amt'>
                    <span><b>Total Amount &nbsp; &nbsp; &nbsp; &#8377; {Math.round(cart_product_price_details.total_price)} </b></span>
                        
                    </div>
                    </div>    
        
                                                         
                </div> ):"" }   
                                         

            {/* 12 - 8 - 4 */}
            
            
            
            </div>

            


        </div> 
    </div>
  )
}

export default Cart
