/*
This file contains various configuration settings for Virtual USA application
Use this file to perform the following:
// 1.  Set application title                                   - [ Tag(s) to look for: applicationName ]
// 2.  Set path and filename for application icon              - [ Tag(s) to look for: applicationIcon ]
// 3.  Set header for Legends panel                            - [ Tag(s) to look for: leftPanelHeader ] 
// 4.  Set URL for help page                                   - [ Tag(s) to look for: HelpURL ]
// 5.  Set Jurisdiction									       - [ Tag(s) to look for: jurisdiction ] 
//
// 6.  Set webmap Id for basemap                               - [ Tag(s) to look for: baseMapId ]
// 7.  Set initial map extent                                  - [ Tag(s) to look for: defaultExtent ]
// 8.  Set URL to create webmap ID while sharing               - [ Tag(s) to look for: addItemUrl, parameter 0 = Username, parameter 1 = Token ]
// 9.  Set URL to share the content with Organization or Group - [ Tag(s) to look for: generateShareLink, parameter 0 = Username, parameter 1 = Webmap ID, parameter 2 = Token ]
//10.  Set URL to publish webmap for sharing                   - [ Tag(s) to look for: generateMapPublishLink, parameter 0 = Webmap ID, parameter 1 = Token]
//
//11.  Set groups in which the content will be searched        - [ Tag(s) to look for: groupID ]
//12.  Set list of portals user can access                     - [ Tag(s) to look for: portalName, portalUrl ]	
//13.  Customize tags to search for content
//13a. Set prefix for Event                                    - [ Tag(s) to look for: eventTagPatternPrefix ]
//13b. Set ESF tags                                            - [ Tag(s) to look for: ESF ]	
//13c. Set ICS tags                                            - [ Tag(s) to look for: ICS ]
//13d. Set Emergency Groups tags                               - [ Tag(s) to look for: EMG ]
//13e. Set Emergency Management Tasks tags                     - [ Tag(s) to look for: EMT ]
//13f. Set tags for Critical Infrastructure                    - [ Tag(s) to look for: ICS ]
//13g. Set tags for Hazard types                               - [ Tag(s) to look for: HAZ ]
//
//14.  Specify URLs for map sharing                            - [ Tag(s) to look for: FacebookShareURL, TwitterShareURL, ShareByMailLink ]
//14a. In case of changing the TinyURL service
//     Specify URL for the new service                         - [ Tag(s) to look for: MapSharingOptions (set TinyURLServiceURL, TinyURLResponseAttribute) ]
//
//15.  Customize error messages
//15a. When map cannot be created with content                 - [ Tag(s) to look for: createMap ]
//15b. Header for error dialog                                 - [ Tag(s) to look for: general ]
//15c. If no contents are found for search term                - [ Tag(s) to look for: agolError ]
//
*/
define({
    root: ({
        viewer: {
            main: {
                //Set application title 
                applicationName: "The Common Library for Information Sharing",
                //                 Set path and filename for application icon 
                applicationIcon: "images/logo.png",
                //                Set header for Legends panel 
                leftPanelHeader: "<b>Legend</b>",
                //                Set Jurisdiction	
                jurisdiction: "Virginia",
                //                Set webmap Id for basemap
                baseMapId: "6e03e8c26aad4b9c92a87c1063ddb0e3",
                //                Set initial map extent   
                defaultExtent: "-9199000, 4345000, -8368000, 4671000",
                //               Set group Id for ESRI feature Group
                featureGroupId: "2394b887a80347fb8544610cfa30489c",
                //                 Set URL to create webmap ID while sharing
                addItemUrl: "http://www.arcgis.com/sharing/content/users/${0}/addItem?f=json&token=${1}",
                //                Set URL to share the content with Organization or Group 
                generateShareLink: "http://www.arcgis.com/sharing/content/users/${0}/items/${1}/share?f=json&token=${2}",
                //                Set URL for the webMap Item Detail
                webMapItemDetail: "http://www.arcgis.com/home/item.html?id=",
                //                Set URL to publish webmap for sharing   
                generateMapPublishLink: "http://www.arcgis.com/sharing/content/items/${0}?f=json&token=${1}"
            },
            //            Set groups in which the content will be searched
            groups: [{
                groupID: "6e4b9e40f5c74be99564234160d26938"
            }
            ],
            //            Set list of portals user can access  
            portal: [{
                portalName: "Virtual USA (vusa.maps.arcgis.com)",
                portalUrl: "//vusa.maps.arcgis.com"
            }, {
                portalName: "Portal1 (vusa.maps.arcgis.com)",
                portalUrl: "//vusa.maps.arcgis.com"
            }, {
                portalName: "Portal2 (vusa.maps.arcgis.com)",
                portalUrl: "//vusa.maps.arcgis.com"
            }
            ],
            //            Set URL for help page 
            HelpURL: "help.htm",
            //             Specify tiny URL services 
            MapSharingOptions: {
                TinyURLServiceURL: "http://api.bit.ly/v3/shorten?login=esri&apiKey=R_65fd9891cd882e2a96b99d4bda1be00e&uri=${0}&format=json",
                TinyURLResponseAttribute: "data.url",
                FacebookShareURL: "http://www.facebook.com/sharer.php?u=${0}&t=vUSA%20Portal",
                TwitterShareURL: "http://twitter.com/home/?status=vUSA' ${0}",
                ShareByMailLink: "mailto:%20?subject=vUSA&body=${0}"
            },
            //            Specify published web map details 
            WebMapParameters: {
                Title: "Shared Web Map",
                Tags: "SharedWebMap",
                Description: "This web map was autogenerated using the Share option in Virtual USA application"
            },
            //            Set prefix for Event
            eventTagPatternPrefix: "vUSA_Event_",
            //            Set ESF tags 
            labelESF: [{
                ESF: "ESF 1 Transportation"
            }, {
                ESF: "ESF 2 Communication"
            }, {
                ESF: "ESF 3 Public Works and Engineering"
            }, {
                ESF: "ESF 4 Firefighting"
            }, {
                ESF: "ESF 5 Emergency Management"
            }, {
                ESF: "ESF 6 Mass Care"
            }, {
                ESF: "ESF 7 Logistics Management and Resource Support"
            }, {
                ESF: "ESF 8 Public Health and Medical Services"
            }, {
                ESF: "ESF 9 Search and Rescue"
            }, {
                ESF: "ESF 10 Oil and Hazardous Materials Response"
            }, {
                ESF: "ESF 11 Agriculture and Natural Resources"
            }, {
                ESF: "ESF 12 Energy"
            }, {
                ESF: "ESF 13 Public Safety and Security"
            }, {
                ESF: "ESF 14 Long-Term Community Recovery"
            }, {
                ESF: "ESF 15 External Affairs"
            }
            ],

            //            Set ICS tags  
            labelICS: [{
                ICS: "Command"
            }, {
                ICS: "Planning"
            }, {
                ICS: "Operations"
            }, {
                ICS: "Logistic"
            }, {
                ICS: "Finance"
            }
            ],

            //            Set Emergency Groups tags
            labelEMAgencyGroup: [{
                EMG: "Preparedness"
            }, {
                EMG: "Mitigation"
            }, {
                EMG: "Response"
            }, {
                EMG: "Recovery"
            }, {
                EMG: "Director's Office"
            }, {
                EMG: "Public Information"
            }, {
                EMG: "Finance and Administration"
            }
            ],


            //Set Emergency Management Tasks tags
            labelEMTask: [{
                EMT: "Damage Assessment"
            }, {
                EMT: "Debris Removal"
            }
            ],

            labelEMFunction: [{
                EMF: "ESF"
            }, {
                EMF: "ICS"
            }
            ],
            //            Set tags for Critical Infrastructure
            labelCISector: [{
                CIS: "Food and Agriculture"
            }, {
                CIS: "Banking and Finance"
            }, {
                CIS: "Chemical"
            }, {
                CIS: "Commercial Facilities"
            }, {
                CIS: "Communications"
            }, {
                CIS: "Critical Manufacturing"
            }, {
                CIS: "Dams"
            }, {
                CIS: "Emergency Services"
            }, {
                CIS: "Energy"
            }, {
                CIS: "Government Facilities"
            }, {
                CIS: "Healthcare and Public Health"
            }, {
                CIS: "Information Technology"
            }, {
                CIS: "National Monuments and Icons"
            }, {
                CIS: "Nuclear Reactors, Materials and Waste"
            }, {
                CIS: "Postal and Shipping"
            }, {
                CIS: "Transportation Systems"
            }, {
                CIS: "Water"
            }
            ],

            //            Set tags for Hazard types 
            labelHazardType: [{
                HAZ: "Avalanche"
            }, {
                HAZ: "Dam Failure"
            }, {
                HAZ: "Drought"
            }, {
                HAZ: "Earthquake"
            }, {
                HAZ: "Erosion and Deposition Expansive Soils"
            }, {
                HAZ: "Extreme Temperatures"
            }, {
                HAZ: "Flood"
            }, {
                HAZ: "Hailstorm"
            }, {
                HAZ: "HAZMAT"
            }, {
                HAZ: "Hurricane"
            }, {
                HAZ: "Landslides/Debris Flows/Rockfalls"
            }, {
                HAZ: "Lightning"
            }, {
                HAZ: "Severe Winter Storms"
            }, {
                HAZ: "Subsidence"
            }, {
                HAZ: "Terrorist Attack"
            }, {
                HAZ: "Tornado"
            }, {
                HAZ: "Tsunami"
            }, {
                HAZ: "Wildfire"
            }, {
                HAZ: "Windstorm"
            }
            ],

            errors: {
                //            When map cannot be created with content 
                createMap: "Unable to create map",
                //             Header for error dialog   
                general: "Error",
                //              If no contents are found for search term 
                agolError: "No results found"
            }
        }
    })
});