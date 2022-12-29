import React, {useState, useEffect} from 'react'
import Header from '../common/Header';
// import SiderbarProducts from '../common/SiderbarProducts';
import '../../css/list.css';
import '../../css/sidebar.css';
import axios from 'axios';
import { getUser, getToken } from '../../utils/Common';
import { useNavigate } from 'react-router-dom';

const PAGE_NUMBER = 1;
const List = () => {

    const [prod_category_name, setProdCategory] = useState();
    const [prod_sub_category_name, setProdSubCategory] = useState();
    const [proddatacheck, setProdsDataCheck] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pageno, setPageNo] = useState(PAGE_NUMBER);
    const [tot_items, setTotItems] = useState(0);
    //filters
    const [brandsinfo, setBrandsInfo] = useState({
        brandsinfos: []
      });

    const [brandsdiscntinfo, setBrandsDiscntInfo] = useState({
        brandsdiscntsinfos: []
      });

    const [prodpriceinfo, setProdPrice] = useState("");

    const [page_name, setPageName] = useState();
    let navigate = useNavigate();

    //state - for storing data's from server into client ui
    const [products, setProducts] = useState([]);


    const user_token = getToken();
    console.log(user_token);
    if(user_token === null){
        navigate("/login"); 
    }

        

    useEffect(() => {
        let url = window.location.href;
        if(url === "http://localhost:3000/products/mobiles/all-mobiles"){   
            setProdCategory('624e952dfee46770570e2ff5');
            setProdSubCategory('6272269f0313b456b53599a3');
            setPageName("Mobiles");

        }else if(url === "http://localhost:3000/products/smart-watches"){
            setProdCategory('626b7e9c3228f7db38a12dce');
            setProdSubCategory('626b802f0c1637207710cf4e');
            setPageName("Smart watches");
        }

        const fetchProductsList = async () =>{
          setLoading(true);
            await axios.post("http://localhost:8001/api/product/list?limit=8&pageno="+pageno+"&sort=desc",
            
            { 
                    search: "",
                    price_range: prodpriceinfo,
                    brand_name: brandsinfo.brandsinfos,
                    category_id: prod_category_name.toString(),
                    sub_category_id: prod_sub_category_name.toString(),
                    discount_percentage: brandsdiscntinfo.brandsdiscntsinfos
            }
            )
            .then(response =>{
              setLoading(false);
                if(response.data.status === "success"){
                  var totitems = response.data.result.total_records;
                  setTotItems(totitems);
                    if(totitems > 0){
                        const new_prods = response.data.result.result;
                        console.log(new_prods);
    
                        if(pageno === 1){
                          setProducts(new_prods);
                        }else{
                          setProducts([...products, ...new_prods]);
                        }
                        setProdsDataCheck(true);
                    }
                    
                }else if(response.data.status === "no_record"){
                  setProducts([]);
                  setProdsDataCheck(false);
                }
                
            }).catch(error => {
                console.log(error);
            })
        }

        fetchProductsList();
    },[prod_category_name, prod_sub_category_name, brandsinfo, brandsdiscntinfo,prodpriceinfo, pageno]);



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
          "name": "Redmi"
        },
        {
          "id": 12,
          "name": "Nokia"
        },
        {
          "id": 13,
          "name": "Nothing Phone"
        }
      ];
    
    const handleBrandsOnChange = (e) => {

    const { value, checked } = e.target;
    const { brandsinfos } = brandsinfo;
      
    console.log(`${value} is ${checked}`);
     
    // Case 1 : The brand checks the box
    if (checked) {
      setBrandsInfo({
        brandsinfos: [...brandsinfos, value]
      });
    }
  
    // Case 2  : The brand unchecks the box
    else {
        setBrandsInfo({
        brandsinfos: brandsinfos.filter((e) => e !== value)
      });
    }

    setPageNo(PAGE_NUMBER);
    console.log(brandsinfo.brandsinfos);
        

    };

    //Discounts
    const brand_discounts = [5, 10, 20, 30, 40, 50, 60, 65, 70];

    const handleDiscountsOnChange = (e) => {
      const { value, checked } = e.target;
      const { brandsdiscntsinfos } = brandsdiscntinfo;
        
      console.log(`${value} is ${checked}`);
      
      // Case 1 : The discount checks the box
      if (checked) {
        setBrandsDiscntInfo({
          brandsdiscntsinfos: [...brandsdiscntsinfos, Number(value)]
        });
      }
    
      // Case 2  : The discount unchecks the box
      else {
        setBrandsDiscntInfo({
            brandsdiscntsinfos: brandsdiscntsinfos.filter((e) => e !== Number(value))
        });
      }

      setPageNo(PAGE_NUMBER);

      console.log(brandsdiscntinfo.brandsdiscntsinfos);

    }

    const handleProdPriceOnChange = (e) => {

      const { value, checked } = e.target;
        
      console.log(`${value} is ${checked}`);

      setProdPrice(value);

      setPageNo(PAGE_NUMBER);

    }

    //pagination 
    const scrollToEnd = () => {
      console.log('1');
      //alert("1");
      setPageNo(pageno + 1);
    }

    const loadProdsMore = (e) => {
      e.preventDefault();
      setPageNo(pageno + 1);
      //fetchPosts(user_id,offset);
      //console.log("loadPostMore");
    }

    // window.onscroll = (e) => {
    //   //check if the page has scrolled to bottom
    //   if(window.innerHeight + e.target.documentElement.scrollTop + 1 > e.target.documentElement.offsetHeight){
    //     scrollToEnd();
    //   }
    // }
  return (
    <div className="App">
    	<Header />
    	{/* Sidebar filter */}
        <div className="sidebar">
      <div className='container' >
        <div className=" " id="style-2">
          {/* BRANDS */}
          <div className="brands_cb">
          <span><strong>Brands</strong></span>

          { mobile_brands.map(mb => 
          <div className="form-check">
            <label className="form-check-label" for={mb.name}>
              <input type="checkbox" className="form-check-input" id={mb.name} name="brand" value={mb.name} onChange={handleBrandsOnChange} />{mb.name}
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
            <label className="form-check-label" for="price_0_to_1000">
              <input type="radio" className="form-check-input" id="price_0_to_1000" name="prod_price" value="0-1000" onChange={handleProdPriceOnChange}/>Under ₹1,000
            </label>
          </div>
          <div className="form-check">
            <label className="form-check-label" for="price_0_to_5000">
              <input type="radio" className="form-check-input" id="price_1000_to_5000" name="prod_price" value="1000-5000" onChange={handleProdPriceOnChange}/>₹1,000 - ₹5,000
            </label>
          </div>
          <div className="form-check" for="price_5000_to_10000">
            <label className="form-check-label" >
              <input type="radio" className="form-check-input" id="prod_5000_to_10000" name="prod_price" value="5000-10000" onChange={handleProdPriceOnChange}/>₹5,000 - ₹10,000
            </label>
          </div>
          <div className="form-check">
            <label className="form-check-label" for="price_10000_to_20000">
              <input type="radio" className="form-check-input" id="prod_10000_to_20000" name="prod_price" value="10000-20000" onChange={handleProdPriceOnChange}/>₹10,000 - ₹20,000
            </label>
          </div>
          <div className="form-check">
            <label className="form-check-label" for="price_20000_to_30000">
              <input type="radio" className="form-check-input" id="price_20000_to_30000" name="prod_price"  value="20000-30000" onChange={handleProdPriceOnChange}/> ₹20,000 - ₹30,000 
            </label>
          </div>
          <div className="form-check">
            <label className="form-check-label" for="price_30000_to_40000">
              <input type="radio" className="form-check-input" id="price_30000_to_40000" name="prod_price"  value="30000-40000" onChange={handleProdPriceOnChange}/> ₹30,000 - ₹40,000 
            </label>
          </div>

          <div className="form-check">
            <label className="form-check-label" for="price_40000_to_100000">
              <input type="radio" className="form-check-input" id="price_40000_to_100000" name="prod_price"  value="40000-100000" onChange={handleProdPriceOnChange}/> Over ₹40,000
            </label>
          </div>

          

        </div>
        {/* PRICE */}
        <hr></hr>
          {/* DISCOUNT */}
          <div className="discounts_cb">
          <span><strong>Discounts</strong></span>
          {brand_discounts.map(bd => 
          <div className="form-check">
            <label className="form-check-label" for={bd}>
              <input type="checkbox" className="form-check-input" id={"bdvalue_"+bd} name="discounts" value={bd} onChange={handleDiscountsOnChange}/>{bd}% Off or more
            </label>
          </div>
          )}
        </div>
        {/* DISCOUNT */}
        </div>
      </div>    

	</div>
        {/* Sidebar filter */}
    <div className="container">
    <h2 className="head_module px-3 pt-3">{page_name}</h2>


        <div className="row text-center row_text_padding">

             { products.map(product => 
            <div className="col-xl-3 col-sm-6 mb-5" key={product._id}>
                <div className="bg-white  shadow-sm py-5 px-4">
                <a href={`/product/${product.model_no+'--'+product.ram+'--'+product.storage+'--'+product.color}/${product.category._id}/${product._id}`} className="">
                 {!!(product.product_image_name)? (<img src={`http://localhost:8001/products/${product.product_image_name}`}  width="100" alt="profile" className="img-fluid  mb-3 img-thumbnail shadow-sm img_product_w_h" /> ) :(<img src={`http://localhost/laravel_api/storage/app/public/uploads/profile/no_profile.jpg`}  width="100" className="img-fluid mb-3 img-thumbnail shadow-sm img_product_w_h" alt="product"/>)}
                
                 <span className="small text-uppercase text-muted text" data-toggle="tooltip" title={product.name}> {product.name} </span>
                </a>  
                    <ul className="social mb-0 list-inline mt-3">
                        <li >
                            
                        <div className="rating">
                        <span className="fnt-12 mtpl-4"><i className="fa fa-angle-down"></i> 11,000</span>
                        <input type="radio" name="rating" value="5" id="5"/><label for="5">☆</label>
                        <input type="radio" name="rating" value="4" id="4"/><label for="4">☆</label>
                        <input type="radio" name="rating" value="3" id="3"/><label for="3">☆</label>
                        <input type="radio" name="rating" value="2" id="2"/><label for="2">☆</label>
                        <input type="radio" name="rating" value="1" id="1"/><label for="1">☆</label>
                    
                        </div>
                        
                        </li>
                        <li className=""><span>&#8377; {product.price - Math.round((product.price / 100) *product.discount.discount_percentage)}</span> <span className="price_line_strikeout">&#8377; {product.price} </span> <span className="fnt-12">&nbsp;({product.discount.discount_percentage} % off)</span></li>
                    
                    </ul>
                </div>

            </div>
             )} 
            
            { proddatacheck === false ? (<div className="bg-white mt-2 mb-5" style={{minHeight : "50px"}}> <p className="mb-0 mt-20 title_text" style={{ paddingTop: "12px", paddingLeft: "30px", width: "1000px"}}> No products found </p></div>) : "" }
            
</div> 
<div><button type="button" style={{ display: !loading && proddatacheck && tot_items >= 8 ? "block" : "none", marginLeft: "140px", marginTop: "-40px" }} className="btn btn-primary  btn-sm" onClick={loadProdsMore}>See More</button></div>
            

           

        </div>
    </div>
  )
}

export default List
