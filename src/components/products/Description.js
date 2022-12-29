import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom'
import Header from '../common/Header';
import {getUser} from '../../utils/Common';
import { useNavigate } from 'react-router-dom';
import '../../css/pdp.css';
const PRODUCT_CNT = 1;
const Description = () => {
    let navigate = useNavigate();
    var pageDefaultCheck = 0;
    const params = useParams();

    console.log(params);

    const productColorsArray = {"Red":"FF0000", "Green":"008000", "Black":"000000", "Mint Green":"98FF98","Graphite Black":"27292b","Chromium White":"E8F1D4"};

    const [productdetails, setProductDetails] = useState([]);
    const [prodloading, setProdLoading] = useState(false);
    const [prodcnt, setProdCnt] = useState(PRODUCT_CNT);
    const [maxprodlimit, setMaxProdLimit] = useState('');
    const [productcolorsdetails, setProductColorsDetails] = useState([]);
    const [productstoragedetails, setProductsStoragDetails] = useState([]);
    const [productsramdetails, setProductsRAMDetails] = useState([]);
    useEffect(() => {
        const getProductDetails = async () => {
            setProdLoading(false);
            await axios.get("http://localhost:8001/api/product/info",{
                params: {
                    product_id: params.id
                }})
            .then(prod_response => {
                console.log(prod_response);
                if(prod_response.data.status === "success"){
    
                    const prodinfo = prod_response.data.result.result;
                    if(!! prodinfo){
                        console.log(prodinfo);
                        setProductDetails(prodinfo);
                        setProdLoading(true);
                        setMaxProdLimit(prodinfo[0].inventory.quantity);
                    }
                    
                }
                setProdLoading(false);
            })
            .catch(err => {
                console.log(err);
            })
        }
        
        getProductDetails();

        if(pageDefaultCheck === 0){
            pageDefaultCheck = 1;
            let device_infos = params.modelno.split('--');
            //colors
            const getProductColors = async () => {
                await axios.get("http://localhost:8001/api/product/colors",{
                params: {
                    category_id: params.categoryid,
                    storage: device_infos[2],
                    ram: device_infos[1],
                    model_no: device_infos[0]

                }})
            .then(prodcolors_response => {

                console.log(prodcolors_response);
                if(prodcolors_response.data.status === "success"){
    
                    const prodcolorsinfo = prodcolors_response.data.result.result;
                    if(!! prodcolorsinfo){
                        console.log(prodcolorsinfo);
                        setProductColorsDetails(prodcolorsinfo);
                    }
                    
                }
            })
            .catch(err => {
                console.log(err);
            });
            }

            getProductColors();


            //storages
            const getProductsStorage = async () => {
                await axios.get("http://localhost:8001/api/product/storage",{
                params: {
                    category_id: params.categoryid,
                    storage: device_infos[2],
                    ram: device_infos[1],
                    model_no: device_infos[0],
                    color: device_infos[3]

                }})
            .then(prodstorage_response => {

                console.log(prodstorage_response);
                if(prodstorage_response.data.status === "success"){
    
                    const prodstorageinfo = prodstorage_response.data.result.result;
                    if(!! prodstorageinfo){
                        console.log(prodstorageinfo);
                        setProductsStoragDetails(prodstorageinfo);
                    }
                    
                }
            })
            .catch(err => {
                console.log(err);
            });
            }

            getProductsStorage();

            //RAM
            const getProductsRAM = async () => {
                await axios.get("http://localhost:8001/api/product/ram",{
                params: {
                    category_id: params.categoryid,
                    storage: device_infos[2],
                    ram: device_infos[1],
                    model_no: device_infos[0],
                    color: device_infos[3]

                }})
            .then(prodsram_response => {

                console.log(prodsram_response);
                if(prodsram_response.data.status === "success"){
    
                    const prodsraminfo = prodsram_response.data.result.result;
                    if(!! prodsraminfo){
                        console.log(prodsraminfo);
                        setProductsRAMDetails(prodsraminfo);
                    }
                    
                }
            })
            .catch(err => {
                console.log(err);
            });
            }

            getProductsRAM();
        }
        
    },[]);

   

    const prodMinus = (e) => {
        e.preventDefault();

        if(prodcnt > 1){
            setProdCnt( prodcnt - 1);
        }
    }

    const prodPlus = (e) =>{
        e.preventDefault();
        
        if(prodcnt < maxprodlimit){
            setProdCnt( prodcnt + 1);
        }

    }

    // const productColorSelect = (color) => {
    //     alert(`color, ${color}`);
    //   }

    let saveAddToCart = async (e) => {
        e.preventDefault();
        console.log(e.target.elements.pdt_qty.value);
        console.log(e.target.elements.pdt_id.value);
        document.getElementById("add_cart_btn").disabled = true; 

        await axios.post("http://localhost:8001/api/cart/create", {
            product_id: e.target.elements.pdt_id.value,
            quantity: e.target.elements.pdt_qty.value,
            user_id: getUser().user_id
        })
        .then(cart_response => {

            if(cart_response.data.status === "success"){
                
                window.setTimeout(() => {
                    document.getElementById("alert_div").innerHTML += "<div className='alert alert-success'><strong>Success!</strong>"+cart_response.data.message+"</div>";
                    navigate('/viewcart');
                }, 3000);

                
            }
            window.setTimeout(() => {
                document.getElementById("alert_div").innerHTML += "<div className='alert alert-info'><strong>Info!</strong>"+cart_response.data.message+"</div>";
            }, 2000);
            document.getElementById("add_cart_btn").disabled = false;

        })
        .catch(err => console.log(err));
    }

  return (
    <div className="App">
        <Header />
        
        { ! prodloading && productdetails.map(productdetail =>
        <div className="container  bg-white mt-5 mb-5" key={productdetail._id}>
            
        <div className="row" style={{paddingTop: "35px"}}>
        
               <div className="col-md-5 item-photo" style={{padding: "30px"}}>
                    <img style={{maxWidth: "100%", height: "491px"}} src={`http://localhost:8001/products/${productdetail.product_image_name}`} alt={productdetail.name}/>
                </div>
                <div className="col-md-7" style={{border:"0px solid gray", paddingLeft: "10px", width: "100%"}}>
                <form id="addcartForm" onSubmit={saveAddToCart}>
                <input type="hidden" value={productdetail._id} name="pdt_id" id="pdt_id" />
                
                    {/* <!-- Datos del vendedor y titulo del producto --> */}
                    <h3 className="max-lines">{productdetail.name} </h3>    
                    {/* <h5 style={{color:"#337ab7"}}>vendido por <a href="#">Samsung</a> <small style={{color:"#337ab7"}}>(5054 ventas)</small></h5> */}
        
                    {/* <!-- Precios --> */}
                    <h6 className="title-price"><small></small></h6>
                    <h3 style={{marginTop:"0px"}}><span>&#8377;{ Number(productdetail.price) - Math.round((Number(productdetail.price) / 100) * Number(productdetail.discount.discount_percentage)) }</span>&nbsp;<span className="price_line_strikeout">&#8377;  {productdetail.price} </span> <span className="fnt-12">&nbsp;({Number(productdetail.discount.discount_percentage)} % off)</span> </h3>
        
                    {/* <!-- Detalles especificos del producto --> */}
                    <div className="section">
                        <h6 className="title-attr" style={{marginTop:"15px"}} ><small>COLOR</small></h6>                    
                        <div style={{marginTop:"5px"}} >
                            {/* <button onClick={() => productColorSelect('Red')} className="attr" style={{width:"25px",background:"#5a5a5a"}}></button>
                            <button onClick={() => productColorSelect('Black')} className="attr" style={{width:"25px",background:"white"}}></button> */}
                            { productcolorsdetails.map(prodcolordetail => 
                             <a href={`/product/${prodcolordetail.model_no+'--'+prodcolordetail.ram+'--'+prodcolordetail.storage+'--'+prodcolordetail.color}/${prodcolordetail.category_id}/${prodcolordetail._id}`} className="">
                            <span className="attr btn btn-default" style={{width:"25px",background:`#${productColorsArray[prodcolordetail.color]}`}}></span>
                            </a>
                            )}
                        </div>
                    </div>
                    <div className="section" style={{paddingBottom:"5px"}}>
                        <h6 className="title-attr"><small>RAM</small></h6>                    
                        <div>
                        { productsramdetails.map(prodsramdetails => 
                            <a href={`/product/${prodsramdetails.model_no+'--'+prodsramdetails.ram+'--'+prodsramdetails.storage+'--'+prodsramdetails.color}/${prodsramdetails.category_id}/${prodsramdetails._id}`} className="" style={{}}>
                                <span className="attr btn btn-default" style={{width:"40px"}}>{prodsramdetails.ram }</span>
                           
                            </a>
                            )}
                        </div>
                    </div>   

                    <div className="section" style={{paddingBottom:"5px"}}>

                        <h6 className="title-attr"><small>Storage</small></h6>                    
                        <div>
                        { productstoragedetails.map(prodsstoragedetails => 
                            <a href={`/product/${prodsstoragedetails.model_no+'--'+prodsstoragedetails.ram+'--'+prodsstoragedetails.storage+'--'+prodsstoragedetails.color}/${prodsstoragedetails.category_id}/${prodsstoragedetails._id}`} className="">
                                <span className="attr btn btn-default" style={{width:"40px"}}>{prodsstoragedetails.storage }</span>
                           
                            </a>
                            )}
                        </div>

                    </div>  
                    <div className="section" style={{paddingBottom:"20px"}}>
                        <h6 className="title-attr"><small>Quantity</small></h6>                    
                        <div style={{marginBottom: "10px"}}>
                            <span className="btn-minus" onClick={prodMinus}><span className="fa fa-minus" ></span></span>
                            <input value={prodcnt} name="pdt_qty" id="pdt_qty" />
                            <span className="btn-plus"  onClick={prodPlus}><span className="fa fa-plus"></span></span>
                        </div>
                        {/* <div class="alert alert-success alert-dismissible">
                        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                        <strong>Success!</strong> Indicates a successful or positive action.
                        </div> */}
                    </div>                
        
                    {/* <!-- Botones de compra --> */}
                    <div className="section" style={{paddingBottom:"20px"}}>
                        <button type="submit" className="btn btn-success" id="add_cart_btn"><span style={{marginRight:"20px"}} className="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span> Add to Cart</button>
                        <h6 style={{paddingTop: "20px", cursor: "pointer"}}> <span className="fa fa-heart-o" style={{cursor:"pointer"}}></span> Add to Wish List </h6>
                    </div>  
                    {/*  */}  
                    <div className="" id="alert_div" style={{paddingTop:"20px"}}>
                    
                   
                    </div> 
                    {/*  */}
                    
                                        
                </form>
                </div>  
                <div className=" row col-xs-9" style={{width: "100%"}}>
                    <ul className="menu-items">
                        <li className="active">Product Specification</li>
                        <li>Garantía</li>
                        <li>Vendedor</li>
                        <li>Envío</li>
                    </ul>
                    <div style={{width:"100%",borderTop:"1px solid silver"}}>
                        <p style={{padding:"15px"}}>
                            <small></small>
                        </p>
                        <small>
                            <ul>
                            {!!(productdetail.description)? (productdetail.description.map(pd =>
                                <li key={pd}>{pd}</li>
                            )) :""}
                                
                            </ul>  
                        </small>
                    </div>
                </div>		
            </div>
        </div> )}
    </div>
  )
}

export default Description
