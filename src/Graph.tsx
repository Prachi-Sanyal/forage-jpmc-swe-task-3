import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[];
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void;
}

class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return <perspective-viewer />;
  }

  componentDidMount() {
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
      // Add new fields for ratio, upper_bound, lower_bound, price_abc, price_def
      ratio: 'float',
      upper_bound: 'float',
      lower_bound: 'float',
      price_abc: 'float',
      price_def: 'float',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }

    if (this.table) {
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      // Remove column-pivots since we're focusing on ratio
      elem.setAttribute('row-pivots', '["timestamp"]');
      // Adjust columns and aggregates to focus on new fields
      elem.setAttribute('columns', '["ratio", "upper_bound", "lower_bound"]');
      elem.setAttribute('aggregates', JSON.stringify({
        ratio: 'avg',
        upper_bound: 'avg',
        lower_bound: 'avg',
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update(
        DataManipulator.generateRow(this.props.data),
      );
    }
  }
}

export default Graph;
