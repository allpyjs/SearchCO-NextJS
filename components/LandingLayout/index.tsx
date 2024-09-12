import Footer from "../Footer";
import Header from "../Header";

const LandingLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {

    return (<>
        <Header />
        {children}
        <Footer />
    </>)
}

export default LandingLayout;