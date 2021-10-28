import React from 'react'

import 'dbux/dist/index.css'
import GenericCatalogue from 'dbux/dist'

const demoHeadings = [
  {
    uid: 'uid',
    label: 'uid',
    type: "text",
  },
  {
    uid: 'label',
    label: 'Label',
    type: "text",
  },
];

const demoData = [
  {
    uid: 'foo',
    label: 'Foo',
  },
  {
    uid: 'bar',
    label: 'Bar',
  },
  {
    uid: 'roo',
    label: 'Roo',
  },
];

const App = () => {
  return (
    <GenericCatalogue
      itemName="A"
      collection="DemoCollection"
      additionalFilters={[]}
      resultsHeadings={demoHeadings}
      editorHeadings={demoHeadings}
      additionalSaveData={{}}
      availableFilters={demoHeadings}
      ItemEditor={() => "PLACEHOLDER"}
      apiGetDocuments={async () => demoData}
      apiDeleteDocument={async () => {}}
      onErrorCallback={(err) => alert(err)}
    />
  )
}

export default App
