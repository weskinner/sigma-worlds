import { Link } from "react-router-dom"
import demo1 from "./images/demo/demo1.png"
import demo2 from "./images/demo/demo2.png"
import demo3 from "./images/demo/demo3.png"
import demo4 from "./images/demo/demo4.png"
import demo5 from "./images/demo/demo5.png"
import demo6 from "./images/demo/demo6.png"
import Page from "./Page"


const demoImages = [demo1,demo2,demo3,demo4,demo5,demo6]

function Planet(image) {
  return (
    <div className="col-4" style={{padding: "30px"}}>
      <img src={image} alt="demo-1" style={{width:"100%"}}></img>
    </div>
  );
}

function Landing() {
  return (
    <Page>
      <div className="row">
        <p style={{ fontSize: "20px" }} className="text-center">
          Create your own procedurally generated NFT world!<br></br>
          <span style={{color: "#6eff00"}}>ANNOUNCING:</span> <Link to="/earth-worlds" style={{color:"#f3d9d9"}}>The Earth Worlds</Link> sale on September 12th! Check out our <Link to="/demo">demo!</Link><br></br>
        </p>
        <p className="text-center"><a href="https://twitter.com/SigmaWorlds">Follow us on Twitter</a></p>
      </div>
      <div className="row">{demoImages.map((i) => Planet(i))}</div>
    </Page>
  );
}

export default Landing