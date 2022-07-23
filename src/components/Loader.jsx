import spinner from "../images/spinner.gif";

function Loader() {
  return (
    <div className="loader d-flex justify-content-center align-items-center">
      <img width={180} className="" src={spinner} alt="Loading..." />
    </div>
  );
}

export default Loader;
