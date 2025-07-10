import Articles from "./components/Articles";
import Footer from "./components/Footer";
import Header from "./components/Header";
function App() {
    return (
        <>
            <Header />
            <main className="center-main">
                <div className="articles-wrapper">
                    <h1>Articles</h1>
                    <Articles />
                </div>
            </main>
            <Footer></Footer>
        </>
    );
}

export default App;
