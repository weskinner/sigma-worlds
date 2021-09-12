import React, { useState } from "react";
import Page from "./Page";

const host =
  process.env.NODE_ENV === "production"
    ? "http://35.169.6.44:5000"
    : "http://localhost:5000";

function Demo() {
  const imageRef = React.useRef();
  const [seed, setSeed] = useState("Orbital!");
  const [address, setAddress] = useState("");
  const [submitText, setSubmitText] = useState("Generate!");
  const [working, setWorking] = useState(false);
  const [generated, setGenerated] = useState(false);
  const generate = async () => {
    setSubmitText("...Terraforming...");
    setWorking(true);

    const response = await fetch(
      `${host}/world?seed=` + encodeURIComponent(seed)
    );
    if (response.headers.get("content-type") == "image/png") {
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob); // https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications#example_using_object_urls_to_display_images
      imageRef.current.src = objectUrl;
      setGenerated(true);
    } else {
      setSubmitText("Busy Try Again");
      setTimeout(() => {
        setWorking(false);
        setSubmitText("Generate!");
      }, 1500);
    }

    setSubmitText("...Cooling...");
    setTimeout(() => {
      setWorking(false);
      setSubmitText("Generate!");
    }, 5000);
  };

  const [error,setError] = useState(null)
  const [reserved, setReserved] = useState(false);
  const reserve = async () => {
    const response = await fetch(`${host}/reserve`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({address,seed}),
    });
    if (response.status === 200) {
      const body = await response.json()
      debugger
      if(body.status !== 1) {
        setError(body.message)
      } else {
        setReserved(true);
      }
    } else {
      console.log(response)
    }
  };

  const [processed, setProcessed] = useState(false);
  const process = async () => {
    const response = await fetch(`${host}/process`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({address,seed}),
    });
    if (response.status === 200 && response.json) {
      setProcessed(true);
    } else {
      console.log(response)
    }
  };

  return (
    <Page>
      <div>
        {error && (
          <>
          <h2>ERROR!</h2>
          <h3>{JSON.stringify(error)}</h3>
          </>
        )}
      </div>
      <div className="row">
        <div>
          <h4>
            Enter Seed Phrase{" "}
            {/* <button className="btn btn-secondary">Random</button> */}
          </h4>
        </div>
        <div className="row">
          <textarea
            value={seed}
            onChange={(e) => {
              setSeed(e.target.value);
            }}
          />
        </div>
        <div className="row mt-4">
          <button
            className="btn btn-primary"
            disabled={working}
            onClick={generate}
          >
            {submitText}
          </button>
        </div>

        {seed && generated && (
          <>
            <div className="mt-3">
              <h4>Enter Address</h4>
            </div>
            <div className="row">
              <input
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </div>
            <div className="row mt-4">
              <button
                className="btn btn-primary"
                disabled={!(address && !working)}
                onClick={reserve}
              >
                Reserve
              </button>
            </div>
          </>
        )}

{seed && generated && reserved && (
          <>
            <div className="mt-3">
              <h1>RESERVED!</h1>
              <p>Send 0.99 ERG to <span>9hCqMZy97mi5qooyKzEWSJB4dcdCBoY4FRykNrcNy3wqcgZ4ayH</span> and you will receive your seed generated SigmaWorld!</p>
            </div>
          </>
        )}

        <div className="text-center">
          <img ref={imageRef}></img>
        </div>
      </div>
    </Page>
  );
}

export default Demo;
