import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProcessesScreen from "@/components/screens/ProcessesScreen.tsx";
import Header from "@/components/ui-components/header.tsx";
import System from "@/components/System/System.tsx";
function MainScreen() {
    
    return (
        <main>
            <Header/>
        <div id="main-content-container" className="main-content-container">
            <div id={"tab-content-container"} className="tab-content-container">
            <Tabs defaultValue="processes" className="w-[500px] items-center">
                <TabsList>
                    <TabsTrigger value="processes">Processes</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>
                <TabsContent value="processes"><ProcessesScreen/></TabsContent>
                <TabsContent value="performance">Performance Stats</TabsContent>
                <TabsContent value="system"><System/></TabsContent>
            </Tabs>
            </div>
        </div>
        </main>
    );
}

export default MainScreen;