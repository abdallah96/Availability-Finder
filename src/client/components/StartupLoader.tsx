export function StartupLoader() {
  return (
    <div className="startup-loader" role="status" aria-live="polite" aria-busy="true">
      <div className="startup-loader-inner">
        <div className="startup-loader-brand">
          <span className="startup-loader-orbit" aria-hidden />
          <img
            className="startup-loader-logo"
            src={`${import.meta.env.BASE_URL}tenhil-logo.png`}
            alt=""
            width={140}
            height={40}
          />
        </div>
        <p className="startup-loader-message">
          <span className="startup-loader-message-emphasis">Thank you for reviewing my task.</span>
        </p>
      </div>
    </div>
  );
}
