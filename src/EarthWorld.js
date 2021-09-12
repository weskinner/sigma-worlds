import Page from "./Page"
import earth from "./images/earth.png"

function EarthWorlds() {
  return (
    <Page>
      <div className="row">
        <h2 style={{color:"#f3d9d9"}}>Earth Worlds Series</h2>
        <p>On September 12th to celebrate the release of Cardano smart contracts we will run a limited
           sale event for <span style={{"color":"brown"}}>EARTH-LIKE</span> planets.  Participants will be able to try different seed phrases
           and reserve the seed once they are satisfied with their creation! Special&nbsp;
           <span style={{"color":"#9600c7"}}>RARITY</span> attributes will be assigned at random during
            the sales event.  Participation in this event will help us bootstrap our community
            and polish our processing code for a more automated style sale.  To incentivise this
            participation we will keep the $ERG price to <span style={{color:"blue"}}>0.99 ERG</span>. Thank you for
            your consideration and support!</p>
        <p>P.S. please follow, retweet, and stay tuned to our <a href="https://twitter.com/SigmaWorlds">twitter</a> for a special mid-week airdrop portal
          announcement next week!
        </p>
        <p className="text-center">
          <img src={earth}></img>
        </p>
      </div>
    </Page>
  );
}

export default EarthWorlds