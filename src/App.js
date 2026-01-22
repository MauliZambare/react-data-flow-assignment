import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';
import FlowCanvas from './components/FlowCanvas';
import PostsList from './components/PostsList';

function App() {
  const [posts, setPosts] = useState([]);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((response) => response.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <header className="App-header d-flex justify-content-between align-items-center">
              <h1>{t("React Data Flow")}</h1>
              <div className="language-switcher">
                <button className="btn btn-light mr-2" onClick={() => changeLanguage('en')}>English</button>
                <button className="btn btn-light" onClick={() => changeLanguage('es')}>Español</button>
              </div>
            </header>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <PostsList posts={posts} />
          </div>
          <div className="col-md-6">
            <FlowCanvas />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
