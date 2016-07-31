define({ "api": [
  {
    "type": "get",
    "url": "/api/activities/bymatch/:matchid",
    "title": "Get activities related to :matchid",
    "name": "GetActivities",
    "group": "activities",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "matchid",
            "description": "<p>The match ID</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "returns List of POLL Objects",
          "type": "json"
        }
      ]
    },
    "filename": "./server.js",
    "groupTitle": "activities"
  },
  {
    "type": "get",
    "url": "/api/activities/",
    "title": "Get all activities",
    "name": "GetAllActivities",
    "group": "activities",
    "version": "0.0.1",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "returns List of ACTIVITY Objects",
          "type": "json"
        }
      ]
    },
    "filename": "./server.js",
    "groupTitle": "activities"
  },
  {
    "type": "post",
    "url": "/api/activities",
    "title": "Post a new activity",
    "name": "PostActivity",
    "group": "activities",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mathchid",
            "description": "<p>The match ID.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "image",
            "description": "<p>The image url</p> "
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "date",
            "description": "<p>Activity timestamp</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "text",
            "description": "<p>Activity text</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "returns Status 200",
          "type": "json"
        }
      ]
    },
    "filename": "./server.js",
    "groupTitle": "activities"
  },
  {
    "type": "get",
    "url": "/api/polls/",
    "title": "Get all polls",
    "name": "GetAllPolls",
    "group": "polls",
    "version": "0.0.1",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "returns List of POLL Objects",
          "type": "json"
        }
      ]
    },
    "filename": "./server.js",
    "groupTitle": "polls"
  },
  {
    "type": "get",
    "url": "/api/polls/bymatch/:matchid",
    "title": "Get polls related to :matchid",
    "name": "GetPolls",
    "group": "polls",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "matchid",
            "description": "<p>The match ID</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "returns List of POLL Objects",
          "type": "json"
        }
      ]
    },
    "filename": "./server.js",
    "groupTitle": "polls"
  },
  {
    "type": "post",
    "url": "/api/polls/vote",
    "title": "Vote on a poll",
    "name": "PollVote",
    "group": "polls",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>The ID of the poll.</p> "
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "answer",
            "description": "<p>The index of the voted answer.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "returns Status 200",
          "type": "json"
        }
      ]
    },
    "filename": "./server.js",
    "groupTitle": "polls"
  },
  {
    "type": "post",
    "url": "/polls",
    "title": "Post a new poll",
    "name": "PostPoll",
    "group": "polls",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mathcid",
            "description": "<p>The match ID.</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "question",
            "description": "<p>The question of the poll.</p> "
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "answers",
            "description": "<p>The array containing the answers for the poll. (e.x. {url: &quot;image_url&quot;, text: &quot;text_for_answer&quot;})</p> "
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>The type of the poll. Two types: (&quot;simple&quot; / &quot;image&quot;)</p> "
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "results",
            "description": "<p>The array holding the votes. (e.x. [10,100,50,35])</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "returns Status 200",
          "type": "json"
        }
      ]
    },
    "filename": "./server.js",
    "groupTitle": "polls"
  }
] });