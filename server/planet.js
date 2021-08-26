const Planet = require("@stefftek/planet.js");
const seedrandom = require("seedrandom")
var PImage = require("pureimage");

module.exports.run = async function(seed, outdir) {
  var fnt = PImage.registerFont("fonts/OpenSans-Bold.ttf", "Open Sans");


  // const seed = process.argv[2];
  const rng = seedrandom(seed)

  const randomColor = () =>
    "#"+((rng() * 0xffffff) << 0).toString(16).padStart(6, "0");

  const randomPercentage = () => Math.floor(rng() * 100)

  let colors = {
    land_color: randomColor(),              //Color of the Main Land
    beach_color: randomColor(),             //Color of the Beaches
    shore_color: randomColor(),             //Color of the Shores
    ocean_color: randomColor(),             //Color of the Deep Ocean
    mountain_color: randomColor(),          //Color of the Mountains
    mountain_top_color: randomColor(),      //Color of the Mountain Top (e.g. Snow)
    crater_color: "#8b9e90",            //Main Color of Craters
    pole_color: "#BDDEEC",              //Color of Poles (Ice)
    cloud_color: "#ffffff",             //Cloud Color
    cloud_opacity: 70,                  //Cloud Base Opacity
    atmosphere_color: "#4F7AAD",        //Atmosphere Color
    atmosphere_opacity: 40,             //Atmosphere Opacity/Density
    shading_level: 2,                   //Shading Level (Float 0-2, 2 = Maximum)
    add_detail: true,                   //Plain Map or a bit more detailed?
  }
  let planet_options = {
    planet_radius: 350 + (rng() * 100),                 //Planet Radius
    atmosphere_radius: 600,             //Atmosphere Radius
    sea_level: 0.42,                    // ALL LEVELS ARE VALUES BETWEEN 0 AND 1
    shore_level: 0.48,
    beach_level: 0.5,
    mountain_level: 0.62,
    mountain_top_level: 0.75,
    cloud_level: 0.62,                  // CLOUD LEVEL IS CUSTOM GENERATED AND NOT AFFECTED BY THE OTHER LEVELS
    cloud_radius: 420,                  //Cloud Radius
    pole_level: 0.50,                   //How big the Poles should be (Float 0-2, 2 = Full Coverage)
    craters: false,                      //Should Craters Spawn?
    clouds: true,                       //Should Clouds Spawn?
    atmosphere: true,                   //Should the Planet have an atmosphere
    poles: false,                        //Should the Planet have icy poles?
    hard_pole_lines: false              //Should the pole line be a hard or a soft cut?
  }

  // let colors = {
  //   land_color: "#" + randomColor(), //Color of the Main Land
  //   beach_color: "#" + randomColor(), //Color of the Beaches
  //   shore_color: "#" + randomColor(), //Color of the Shores
  //   ocean_color: "#" + randomColor(), //Color of the Deep Ocean
  //   mountain_color: "#" + randomColor(), //Color of the Mountains
  //   mountain_top_color: "#" + randomColor(), //Color of the Mountain Top (e.g. Snow)
  //   crater_color: "#" + randomColor(), //Main Color of Craters
  //   pole_color: "#" + randomColor(), //Color of Poles (Ice)
  //   cloud_color: "#" + randomColor(), //Cloud Color
  //   cloud_opacity: randomPercentage(), //Cloud Base Opacity
  //   atmosphere_color: "#" + randomColor(), //Atmosphere Color
  //   atmosphere_opacity: randomPercentage(), //Atmosphere Opacity/Density
  //   shading_level: 2, //Shading Level (Float 0-2, 2 = Maximum)
  //   add_detail: false, //Plain Map or a bit more detailed?
  // };
  // let planet_options = {
  //   planet_radius: 400, //Planet Radius
  //   atmosphere_radius: 600, //Atmosphere Radius
  //   sea_level: rng(), // ALL LEVELS ARE VALUES BETWEEN 0 AND 1
  //   shore_level: rng(),
  //   beach_level: rng(),
  //   mountain_level: rng(),
  //   mountain_top_level: rng(),
  //   cloud_level: rng(), // CLOUD LEVEL IS CUSTOM GENERATED AND NOT AFFECTED BY THE OTHER LEVELS
  //   cloud_radius: 420, //Cloud Radius
  //   pole_level: 0.5, //How big the Poles should be (Float 0-2, 2 = Full Coverage)
  //   craters: false, //Should Craters Spawn?
  //   clouds: true, //Should Clouds Spawn?
  //   atmosphere: true, //Should the Planet have an atmosphere
  //   poles: true, //Should the Planet have icy poles?
  //   hard_pole_lines: false, //Should the pole line be a hard or a soft cut?
  // };

  let generator_options = {
      octaveCount: 9,                     //Perlin Noise Octave (How Often)
      amplitude: 5,                       //Perlin Noise Amp (How Big)
      persistence: 0.5                    //Perlin Noise persistence (How Smooth, smaller number = smoother)
  }

  let cloud_generator = {
      octaveCount: 6,
      amplitude: 6,
      persistence: 0.4
  }

  let size = 1000; //Control the ImageSize


  /*
      Planet.js returns an PureImage Image

      Parameters: - imageSize
                  - planetOptions
                  - planetColors

      Optional:   - generatorOptions
                  - cloudGeneratorOptions
  */
  let image = Planet.generatePlanet(
    size,
    planet_options,
    colors,
    seed,
    generator_options,
    cloud_generator
  );

  const path = `${outdir}/${seed}.png`
  return new Promise(async (resolve, reject) => {
    fnt.load(async () => {
  
      let ctx = image.getContext("2d");
      ctx.font = "200px Open Sans";
      ctx.fillStyle = "white";
      ctx.fillText("Σ", 450, 600);
      
      /*
      Export with PureImage
      */
      await Planet.save(image, path); //Image Object and Path
      resolve({path})
    })
  })

}