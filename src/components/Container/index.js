import React from 'react';
import PropTypes from 'prop-types';
import {
    Col,
    Row,
} from 'antd';

import './index.css';

export default class Container extends React.Component {
    render() {
        const { blocks } = this.props;
        const cols = blocks.map((num, i) => {
            return (
                <Col className="layout__col" key={i} span={num}></Col>
            );
        });
        return (
            <Row className="layout__row">{cols}</Row>
        );
    }
}

Container.propTypes = {
    blocks: PropTypes.array,
};
