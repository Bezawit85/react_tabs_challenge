import { useState, useEffect } from "react";

const Tabs = () => {
  const [currentTab, setCurrentTab] = useState();
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    const fetchTabs = async () => {
      const cachedTabs = localStorage.getItem("tabsData");

      if (cachedTabs) {
        const parsedTabs = JSON.parse(cachedTabs);
        setTabs(parsedTabs);
        setCurrentTab(parsedTabs[0]?.id);
      } else {
        try {
          const response = await fetch(
            "https://thingproxy.freeboard.io/fetch/https://loripsum.net/api"
          );
          const text = await response.text();

          const paragraphs = text
            .split("<p>")
            .slice(1)
            .map((p) => p.split("</p>")[0]);

          const fetchedTabs = paragraphs.map((content, index) => ({
            id: index + 1,
            tabTitle: `Tab ${index + 1}`,
            title: `Title ${index + 1}`,
            content: content,
          }));

          setTabs(fetchedTabs);
          setCurrentTab(fetchedTabs[0]?.id);
          localStorage.setItem("tabsData", JSON.stringify(fetchedTabs));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchTabs();
  }, []);

  const handleTabClick = (id) => {
    setCurrentTab(id);
  };

  return (
    <div className="container">
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={tab.id}
            disabled={currentTab === tab.id}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.tabTitle}
          </button>
        ))}
      </div>
      <div className="content">
        {tabs.map((tab) => (
          <div key={tab.id}>
            {currentTab === tab.id && (
              <div>
                <p className="title">{tab.title}</p>
                <p dangerouslySetInnerHTML={{ __html: tab.content }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
