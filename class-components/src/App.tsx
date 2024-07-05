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
      return <h1 id="err-text">Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

interface AppProps {}

interface AppState {
  searchTerm: string;
  results: { name: string; url: string }[];
  isLoading: boolean;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      searchTerm: '',
      results: [],
      isLoading: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      searchTerm: e.target.value.replace(/\s/g, `%`),
    });
  }

  handleClick() {
    const url: string = `https://pokeapi.co/api/v2/${this.state.searchTerm}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          results: data.results,
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  dataPrepare(data: { name: string; url: string }[]) {
    return data.map((element, i) => (
      <div key={`item-${i}`} className="result-item">
        <p className="result-name">{element.name}</p>
        <p className="result-url">{element.url}</p>
      </div>
    ));
  }

  render() {
    return (
      <ErrorBoundary>
        <section id="search">
          <input id="input-search" onChange={this.handleChange}></input>
          <button id="btn-search" onClick={this.handleClick}>
            Search
          </button>
        </section>
        <section id="main">{this.dataPrepare(this.state.results)}</section>
      </ErrorBoundary>
    );
  }
}

export default App;
