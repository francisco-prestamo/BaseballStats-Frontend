import { GiBaseballBat, GiBaseballGlove } from "react-icons/gi";
import { PiBaseballCap } from "react-icons/pi";

const Home = () => {
    const features = [
        {
            icon: <GiBaseballGlove className="w-10 h-10 text-primary dark:text-primary-lighter" />,
            title: "Field Positions",
            description: "Explore the detailed field positions of both teams with interactive cards displaying real-time stats.",
        },
        {
            icon: <GiBaseballBat className="w-10 h-10 text-primary dark:text-primary-lighter" />,
            title: "Batting Lineups",
            description: "Track batting orders and analyze player performance with dynamic lineup statistics.",
        },
        {
            icon: <PiBaseballCap className="w-10 h-10 text-primary dark:text-primary-lighter" />,
            title: "Live Substitutions",
            description: "All player substitutions with timestamps and strategic insights.",
        },
    ];

    return (
        <div className="container mx-auto p-6 space-y-10">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 shadow-lg text-text-light">
                <div className="max-w-3xl mx-auto text-center space-y-4">
                    <h1 className="text-5xl font-extrabold tracking-tight mb-4 animate-fade-in">
                        Baseball Stats
                    </h1>
                    <p className="text-lg md:text-xl animate-slide-up">
                        lorem ipsum
                    </p>
                </div>
            </div>

            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="group bg-bg-light dark:bg-primary-light rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 border border-primary/20 dark:border-primary-lighter/20 hover:border-primary/40 dark:hover:border-primary-lighter/40"
                    >
                        <div className="flex justify-center items-center mb-6 animate-pop-in">
                            {feature.icon}
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-text-dark dark:text-text-light text-center mb-3">
                            {feature.title}
                        </h3>
                        <p className="text-sm text-center text-text-dark/70 dark:text-text-light/70 group-hover:opacity-100 transition-opacity duration-200">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;