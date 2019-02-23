module.exports = {
  "src_folders" : ["test"],
  "output_folder" : "reports",
  "custom_commands_path" : "",
  "custom_assertions_path" : "",
  "page_objects_path" : "",
  "globals_path" : "nightwatch.globals.js",

  "selenium" : {
    "start_process" : false,
    "server_path" : require('selenium-server').path,
    "log_path" : "",
    "host": "127.0.0.1",
    "port" : 9515,
    "cli_args" : {
      "webdriver.chrome.driver" : require('chromedriver').path
    }
  },

  "test_settings" : {
    "default" : {
      "launch_url" : "http://localhost",
      "selenium_port"  : 9515,
      "selenium_host"  : "localhost",
      "default_path_prefix" : "",
      "silent": true,
      "screenshots" : {
        "enabled" : false,
        "path" : ""
      },
      "desiredCapabilities": {
        "browserName": "chrome",
        "chromeOptions" : {
          "args" : ["--no-sandbox"]
        },
        "acceptSslCerts": true
      }
    }
  }
}
