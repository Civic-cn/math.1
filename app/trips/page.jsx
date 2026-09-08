    import MapView from "../../components/MapView.jsx";

    export default function TripsPage() {
    return (
            <div style={{
    width: "100vw",
    height: "calc(100vh - 56px)",
    marginLeft: "calc(-50vw + 50%)",
    marginTop: "-56px",        // ← 加这行，抵消掉 padding-top: 56px
    background: "#fff"
    }}>
    <MapView />
    </div>

    );
    }
