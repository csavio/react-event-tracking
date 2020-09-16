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
import React from 'react';

/**
 * Interface for manipulation of context and event triggering.
 * Implementation is defined in TrackingProvider. `_data` is intended for internal
 * use only and should be considered private.
 */
const context = {
    _data: { // Intended for private use only
        eventFields: {},
        eventOptions: {},
        eventSchema: {},
        fields: {},
        options: {},
        schema: {},
        // The original trigger implementation passed in to TrackingProvider
        trigger: null
    },
    // Used to determine if a TrackingProvider exists in the context chain.
    hasProvider: false,
    // The trigger function passed in to TrackingProvider wrapped with data merging.
    trigger: /* istanbul ignore next */ () => {}
};

// React.createContext will return an object with Provider and Consumer members.
const TrackingContext = React.createContext(context);

export default TrackingContext;
