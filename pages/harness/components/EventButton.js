/*
 * Copyright 2019 Expedia Group, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {TrackingContext} from '../../../src/index';

class EventButton extends PureComponent {
    static contextType = TrackingContext;

    static propTypes = {
        /** Event name. */
        event: PropTypes.string,
        /** Object of string values that represents the default fields to apply to all events within this context. */
        fields: PropTypes.objectOf(PropTypes.string),
        /** Button label. */
        label: PropTypes.string,
        /** The trigger options. */
        options: PropTypes.objectOf(PropTypes.string)
    };

    static defaultProps = {
        event: 'generic.click',
        fields: {},
        label: 'Click Me',
        options: {}
    };

    componentDidMount() {
        this.handleClick();
    }

    handleClick = () => {
        const {event, fields, options} = this.props;

        this.context.trigger(event, fields, options);
    }

    render() {
        const {label} = this.props;
        return (
            <button onClick={this.handleClick}>
                {label}
            </button>
        );
    }
}

export default EventButton;
