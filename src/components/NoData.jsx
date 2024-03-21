

export default function NoData({ 
  onClick,
  message,
  buttonText="upload now",
  title="it's looking empty here...",
  style={},
 }) {

  return (
    <div className="empty" 
    style={{ 
      display: "flex",
      alignItems: "center", 
      justifyContent: "center", 
      gap: 30,
      paddingBottom: 120,
      ...style,
      }}
    >
      <p>{ title }</p>
      <span>{ message }</span>
      <button 
      className="default-btn" 
      style={{alignSelf: "center"}}
       onClick={onClick}
      >
        { buttonText }
      </button>
    </div>
  )
}