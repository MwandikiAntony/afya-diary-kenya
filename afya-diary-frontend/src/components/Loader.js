import React from "react";

export default function Loader() {
  return (
    <div style={styles.wrap}>
      <div style={styles.spinner} aria-hidden="true" />
    </div>
  );
}

const styles = {
  wrap: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8f9fb",
  },
  spinner: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    border: "6px solid #e6f2f8",
    borderTopColor: "#3498db",
    animation: "spin 1s linear infinite",
  },
};

/* Add the animation in your global CSS (index.css):
@keyframes spin {
  to { transform: rotate(360deg); }
}
*/
