import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log(`Error: ${error} ${errorInfo} `);
  }

  render() {
    if (this.state.hasError) {
      return <p id="err-text">Something went wrong. Reload page.</p>;
    }

    return this.props.children;
  }
}

interface ErrorBurronsProps {}

interface ErrorButtonState {
  errorSim: boolean;
}

class ErrorButton extends React.Component<ErrorBurronsProps, ErrorButtonState> {
  constructor(props: ErrorBurronsProps) {
    super(props);
    this.state = { errorSim: false };
    this.throwError = this.throwError.bind(this);
  }

  throwError() {
    this.setState({
      errorSim: true,
    });
  }

  render(): React.ReactNode {
    if (this.state.errorSim) {
      throw new Error("That's ok, just error simulation!");
    }
    return (
      <button id="btn-error" onClick={this.throwError}>
        Throw error
      </button>
    );
  }
}

interface AppProps {}

interface AppState {
  searchTerm: string;
  results: { name: string; url: string }[];
  errorSim: boolean;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      searchTerm: localStorage.getItem('searchTerm') || '',
      results: [],
      errorSim: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.throwError = this.throwError.bind(this);
  }

  // componentDidMount() {
  //   this.handleClick();
  // }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      searchTerm: e.target.value.replace(/\s/g, `%`),
    });
  }

  handleClick() {
    const { searchTerm } = this.state;
    const url: string = `https://pokeapi.co/api/v2/${this.state.searchTerm}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          results: data.results,
        });
        localStorage.setItem('searchTerm', searchTerm);
      })

      .catch((error) => {
        console.error('Error:', error);
      });
  }

  handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      this.handleClick();
    }
  }

  dataPrepare(data: { name: string; url: string }[]) {
    if (!data) {
      throw new Error('Data not exist.');
    }
    return data.map((element, i) => (
      <div key={`item-${i}`} className="result-item">
        <p className="result-name">{element.name}</p>
        <p className="result-url">{element.url}</p>
      </div>
    ));
  }

  throwError() {
    this.setState({
      errorSim: true,
    });
  }

  render() {
    return (
      <>
        <ErrorBoundary>
          <section id="search">
            <input
              id="input-search"
              onChange={this.handleChange}
              onKeyDown={this.handleKeyPress}
              value={this.state.searchTerm}
            ></input>
            <button id="btn-search" onClick={this.handleClick}>
              Search
            </button>
          </section>
        </ErrorBoundary>
        <ErrorBoundary>
          <section id="main">{this.dataPrepare(this.state.results)}</section>
        </ErrorBoundary>
        <ErrorBoundary>
          <ErrorButton />
        </ErrorBoundary>
      </>
    );
  }
}

export default App;
