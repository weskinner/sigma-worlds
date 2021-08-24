import demo1 from "./images/demo/demo-1.png"
import demo2 from "./images/demo/demo-2.png"
import demo3 from "./images/demo/demo-3.png"
import demo4 from "./images/demo/demo-4.png"
import demo5 from "./images/demo/demo-5.png"
import demo6 from "./images/demo/demo-6.png"
import demo7 from "./images/demo/demo-7.png"
import "bootstrap/dist/css/bootstrap.css";


const demoImages = [demo1,demo2,demo3,demo5,demo6,demo7]

function Planet(image) {
  return (
    <div className="col-4" style={{padding: "30px"}}>
      <img src={image} alt="demo-1" style={{width:"100%"}}></img>
    </div>
  );
}

function Landing() {
  return (
    <div style={{ backgroundColor: "#ff0099", height: "100%", color: "yellow" }}>
      <div className="container" style={{ paddingTop: "170px" }}>
        <div>
          <h1 style={{ fontSize: "90px" }} className="text-center">
            Sigma Worlds
          </h1>
        </div>
        <div className="row">
          <p style={{ fontSize: "30px" }} className="text-center">
            Choose your own proceduraly generated NFT world!<br></br>Rarity
            assigned randomly during sale event.
          </p>
        </div>
        <div className="row">{demoImages.map((i) => Planet(i))}</div>
      </div>
    </div>
  );
}

export default Landing