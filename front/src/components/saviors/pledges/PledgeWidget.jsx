// export default function PledgeWidget({ pledge, nav }) {
//   let { impact_level } = pledge
//    impact_level = impact_level || ["good", "normal", "great"][~~(Math.random() * 3)]

//   return (
//     <div className="showcase-widget" 
//     tabIndex={1} onClick={() => nav && nav(`../pledges/${pledge._id}`)}
//     >
//       <div className="title description">
//         <span style={{fontSize: "1.12em"}} className="label">{pledge.name}</span>
//         <span className={`indication ${impact_level}`}></span>
//         {/* <span className="material-symbols-rounded">
//           equalizer
//         </span> */}
//       </div>
//       <div className="pledge-info">
//         <div className="info-columns">
//           <span>CO2e reduction:</span>
//           <span>{pledge.co2e_factor.toFixed(2)} kg</span>
//         </div>
//         <div className="info-columns">
//           <span>total CO2e:</span>
//           <span>{pledge.co2e_factor.toFixed(2)} kg</span>
//         </div>
//         <div className="reflection"></div>
//       </div>
//     </div>
//   )
// }
