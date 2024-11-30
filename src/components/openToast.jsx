import toast from "react-hot-toast";


export const openToast =  (promise, messages) => {
  return toast.promise(
    promise,
    {
      loading: (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span role="img" aria-label="loading-icon">
            ⏳
          </span>
          <span style={{ marginLeft: 8 }}>{messages.loading}</span>
        </div>
      ),
      success: (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span role="img" aria-label="success-icon">
            👏
          </span>
          <span style={{ marginLeft: 8 }}>{messages.success}</span>
        </div>
      ),
      error: (err) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span role="img" aria-label="error-icon">
            ❌
          </span>
          <span style={{ marginLeft: 8 }}>
            {typeof messages.error === "function"
              ? messages.error(err)
              : messages.error || `Error: ${err.message || err}`}
          </span>
        </div>
      ),
    },
    {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    }
  );
};