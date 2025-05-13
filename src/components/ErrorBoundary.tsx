import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  errorInfo?: string;
};

class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorInfo: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: "red", background: "black" }}>
          <h2>🔥 קרתה שגיאה במשחק</h2>
          <p>{this.state.errorInfo}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
