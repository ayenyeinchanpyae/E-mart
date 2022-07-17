// function Loader() {
//   return (
//     <div className="d-flex justify-content-center loader">
//       <div className="spinner-border" role="status">
//         <span className="sr-only"></span>
//       </div>
//     </div>
//   );
// }

// export default Loader;
import spinner from "../images/spinner.gif";

function Loader() {
  return (
    <div className="loader d-flex justify-content-center align-items-center">
      <img width={180} className="" src={spinner} alt="Loading..." />
    </div>
  );
}

export default Loader;
