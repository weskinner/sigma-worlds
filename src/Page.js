const { Link } = require("react-router-dom");

function Page(props) {
  return (
    <div style={{ backgroundColor: "#ff0099", height: "100%", color: "yellow", fontFamily: "'Press Start 2P'", }}>
      <div className="container" style={{ paddingTop: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "90px" }} className="text-center">
            Sigma Worlds
          </h1>
          <p className="text-center">
            <Link to="/" className="p-2">Home</Link>
            <Link to="/demo" className="p-2">Demo</Link>
          </p>
        </div>
        {props.children}
        <div className="text-center p-4">
          <p>Made with 💛 by WΣS</p>
        </div>
      </div>
    </div>
  );
}

export default Page