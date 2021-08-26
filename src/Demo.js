import React, { useState } from "react"
import Page from "./Page"

const host = process.env.NODE_ENV === "production" ? "http://35.169.6.44:5000" : "http://localhost:5000"

function Demo() {
  const imageRef = React.useRef();
  const [seed,setSeed] = useState("Orbital!")
  const [submitText, setSubmitText] = useState("Generate!")
  const [working, setWorking] = useState(false)
  const [image, setImage] = useState(null)
  const generate = async () => {
    setSubmitText("...Terraforming...")
    setWorking(true)

    const response = await fetch(`${host}/world?seed=`+encodeURIComponent(seed))
    if(response.headers.get("content-type") == "image/png") {
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob) // https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications#example_using_object_urls_to_display_images
      imageRef.current.src = objectUrl
    } else {
      setSubmitText("Busy Try Again")
      setTimeout(() => {
        setWorking(false)
        setSubmitText("Generate!")
      }, 1500);
    }

    setSubmitText("...Cooling...")
    setTimeout(() => {
      setWorking(false)
      setSubmitText("Generate!")
    }, 5000);
  }
  return (
    <Page>
      <div className="row">
        <div>
          <h4>Enter Seed Phrase {/* <button className="btn btn-secondary">Random</button> */}</h4>
        </div>
        <div className="row">
          <textarea value={seed} onChange={(e) => {setSeed(e.target.value)}} />
        </div>
        <div className="row mt-4">
          <button className="btn btn-primary" disabled={working} onClick={generate}>{submitText}</button>
        </div>
        <div className="text-center">
          <img ref={imageRef} ></img>
        </div>
      </div>
    </Page>
  );
}

export default Demo