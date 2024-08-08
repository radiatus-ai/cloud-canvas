resource "google_dialogflow_cx_page" "main" {
  parent       = var.agent.start_flow
  display_name = var.name

  entry_fulfillment {
    messages {
      channel = "some-channel"
      text {
        text = ["Welcome to page"]
      }
    }
    messages {
      payload = <<EOF
        {"some-key": "some-value", "other-key": ["other-value"]}
      EOF
    }
    messages {
      conversation_success {
        metadata = <<EOF
          {"some-metadata-key": "some-value", "other-metadata-key": 1234}
        EOF
      }
    }
    messages {
      output_audio_text {
        text = "some output text"
      }
    }
    messages {
      output_audio_text {
        ssml = <<EOF
          <speak>Some example <say-as interpret-as="characters">SSML XML</say-as></speak>
        EOF
      }
    }
    messages {
      live_agent_handoff {
        metadata = <<EOF
          {"some-metadata-key": "some-value", "other-metadata-key": 1234}
        EOF
      }
    }
    messages {
      play_audio {
        audio_uri = "http://example.com/some-audio-file.mp3"
      }
    }
    messages {
      telephony_transfer_call {
        phone_number = "1-234-567-8901"
      }
    }

    set_parameter_actions {
      parameter = "some-param"
      value     = "123.45"
    }
    set_parameter_actions {
      parameter = "another-param"
      value     = jsonencode("abc")
    }
    set_parameter_actions {
      parameter = "other-param"
      value     = jsonencode(["foo"])
    }

    conditional_cases {
      cases = jsonencode([
        {
          condition = "$sys.func.RAND() < 0.5",
          caseContent = [
            {
              message = { text = { text = ["First case"] } }
            },
            {
              additionalCases = {
                cases = [
                  {
                    condition = "$sys.func.RAND() < 0.2"
                    caseContent = [
                      {
                        message = { text = { text = ["Nested case"] } }
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        {
          caseContent = [
            {
              message = { text = { text = ["Final case"] } }
            }
          ]
        },
      ])
    }
  }

  event_handlers {
    event = "some-event"
    trigger_fulfillment {
      return_partial_responses = true
      messages {
        channel = "some-channel"
        text {
          text = ["Some text"]
        }
      }
      messages {
        payload = <<EOF
          {"some-key": "some-value", "other-key": ["other-value"]}
        EOF
      }
      messages {
        conversation_success {
          metadata = <<EOF
            {"some-metadata-key": "some-value", "other-metadata-key": 1234}
          EOF
        }
      }
      messages {
        output_audio_text {
          text = "some output text"
        }
      }
      messages {
        output_audio_text {
          ssml = <<EOF
            <speak>Some example <say-as interpret-as="characters">SSML XML</say-as></speak>
          EOF
        }
      }
      messages {
        live_agent_handoff {
          metadata = <<EOF
            {"some-metadata-key": "some-value", "other-metadata-key": 1234}
          EOF
        }
      }
      messages {
        play_audio {
          audio_uri = "http://example.com/some-audio-file.mp3"
        }
      }
      messages {
        telephony_transfer_call {
          phone_number = "1-234-567-8901"
        }
      }

      set_parameter_actions {
        parameter = "some-param"
        value     = "123.45"
      }
      set_parameter_actions {
        parameter = "another-param"
        value     = jsonencode("abc")
      }
      set_parameter_actions {
        parameter = "other-param"
        value     = jsonencode(["foo"])
      }

      conditional_cases {
        cases = jsonencode([
          {
            condition = "$sys.func.RAND() < 0.5",
            caseContent = [
              {
                message = { text = { text = ["First case"] } }
              },
              {
                additionalCases = {
                  cases = [
                    {
                      condition = "$sys.func.RAND() < 0.2"
                      caseContent = [
                        {
                          message = { text = { text = ["Nested case"] } }
                        }
                      ]
                    }
                  ]
                }
              }
            ]
          },
          {
            caseContent = [
              {
                message = { text = { text = ["Final case"] } }
              }
            ]
          },
        ])
      }
    }
  }

  form {
    parameters {
      display_name  = "param1"
      entity_type   = "projects/-/locations/-/agents/-/entityTypes/sys.date"
      default_value = jsonencode("2000-01-01")
      fill_behavior {
        initial_prompt_fulfillment {
          messages {
            channel = "some-channel"
            text {
              text = ["Please provide param1"]
            }
          }
          messages {
            payload = <<EOF
              {"some-key": "some-value", "other-key": ["other-value"]}
            EOF
          }
          messages {
            conversation_success {
              metadata = <<EOF
                {"some-metadata-key": "some-value", "other-metadata-key": 1234}
              EOF
            }
          }
          messages {
            output_audio_text {
              text = "some output text"
            }
          }
          messages {
            output_audio_text {
              ssml = <<EOF
                <speak>Some example <say-as interpret-as="characters">SSML XML</say-as></speak>
              EOF
            }
          }
          messages {
            live_agent_handoff {
              metadata = <<EOF
                {"some-metadata-key": "some-value", "other-metadata-key": 1234}
              EOF
            }
          }
          messages {
            play_audio {
              audio_uri = "http://example.com/some-audio-file.mp3"
            }
          }
          messages {
            telephony_transfer_call {
              phone_number = "1-234-567-8901"
            }
          }

          set_parameter_actions {
            parameter = "some-param"
            value     = "123.45"
          }
          set_parameter_actions {
            parameter = "another-param"
            value     = jsonencode("abc")
          }
          set_parameter_actions {
            parameter = "other-param"
            value     = jsonencode(["foo"])
          }

          conditional_cases {
            cases = jsonencode([
              {
                condition = "$sys.func.RAND() < 0.5",
                caseContent = [
                  {
                    message = { text = { text = ["First case"] } }
                  },
                  {
                    additionalCases = {
                      cases = [
                        {
                          condition = "$sys.func.RAND() < 0.2"
                          caseContent = [
                            {
                              message = { text = { text = ["Nested case"] } }
                            }
                          ]
                        }
                      ]
                    }
                  }
                ]
              },
              {
                caseContent = [
                  {
                    message = { text = { text = ["Final case"] } }
                  }
                ]
              },
            ])
          }
        }
        reprompt_event_handlers {
          event = "sys.no-match-1"
          trigger_fulfillment {
            return_partial_responses = true
            # webhook = google_dialogflow_cx_webhook.my_webhook.id
            tag = "some-tag"

            messages {
              channel = "some-channel"
              text {
                text = ["Please provide param1"]
              }
            }
            messages {
              payload = <<EOF
                {"some-key": "some-value", "other-key": ["other-value"]}
              EOF
            }
            messages {
              conversation_success {
                metadata = <<EOF
                  {"some-metadata-key": "some-value", "other-metadata-key": 1234}
                EOF
              }
            }
            messages {
              output_audio_text {
                text = "some output text"
              }
            }
            messages {
              output_audio_text {
                ssml = <<EOF
                  <speak>Some example <say-as interpret-as="characters">SSML XML</say-as></speak>
                EOF
              }
            }
            messages {
              live_agent_handoff {
                metadata = <<EOF
                  {"some-metadata-key": "some-value", "other-metadata-key": 1234}
                EOF
              }
            }
            messages {
              play_audio {
                audio_uri = "http://example.com/some-audio-file.mp3"
              }
            }
            messages {
              telephony_transfer_call {
                phone_number = "1-234-567-8901"
              }
            }

            set_parameter_actions {
              parameter = "some-param"
              value     = "123.45"
            }
            set_parameter_actions {
              parameter = "another-param"
              value     = jsonencode("abc")
            }
            set_parameter_actions {
              parameter = "other-param"
              value     = jsonencode(["foo"])
            }

            conditional_cases {
              cases = jsonencode([
                {
                  condition = "$sys.func.RAND() < 0.5",
                  caseContent = [
                    {
                      message = { text = { text = ["First case"] } }
                    },
                    {
                      additionalCases = {
                        cases = [
                          {
                            condition = "$sys.func.RAND() < 0.2"
                            caseContent = [
                              {
                                message = { text = { text = ["Nested case"] } }
                              }
                            ]
                          }
                        ]
                      }
                    }
                  ]
                },
                {
                  caseContent = [
                    {
                      message = { text = { text = ["Final case"] } }
                    }
                  ]
                },
              ])
            }
          }
        }
        reprompt_event_handlers {
          event       = "sys.no-match-2"
          target_flow = var.agent.start_flow
        }
        reprompt_event_handlers {
          event       = "sys.no-match-3"
          target_page = google_dialogflow_cx_page.my_page2.id
        }
      }
      required = "true"
      redact   = "true"
      advanced_settings {
        dtmf_settings {
          enabled      = true
          max_digits   = 1
          finish_digit = "#"
        }
      }
    }
  }

  transition_routes {
    condition = "$page.params.status = 'FINAL'"
    trigger_fulfillment {
      messages {
        channel = "some-channel"
        text {
          text = ["information completed, navigating to page 2"]
        }
      }
      messages {
        payload = <<EOF
          {"some-key": "some-value", "other-key": ["other-value"]}
        EOF
      }
      messages {
        conversation_success {
          metadata = <<EOF
            {"some-metadata-key": "some-value", "other-metadata-key": 1234}
          EOF
        }
      }
      messages {
        output_audio_text {
          text = "some output text"
        }
      }
      messages {
        output_audio_text {
          ssml = <<EOF
            <speak>Some example <say-as interpret-as="characters">SSML XML</say-as></speak>
          EOF
        }
      }
      messages {
        live_agent_handoff {
          metadata = <<EOF
            {"some-metadata-key": "some-value", "other-metadata-key": 1234}
          EOF
        }
      }
      messages {
        play_audio {
          audio_uri = "http://example.com/some-audio-file.mp3"
        }
      }
      messages {
        telephony_transfer_call {
          phone_number = "1-234-567-8901"
        }
      }

      set_parameter_actions {
        parameter = "some-param"
        value     = "123.45"
      }
      set_parameter_actions {
        parameter = "another-param"
        value     = jsonencode("abc")
      }
      set_parameter_actions {
        parameter = "other-param"
        value     = jsonencode(["foo"])
      }

      conditional_cases {
        cases = jsonencode([
          {
            condition = "$sys.func.RAND() < 0.5",
            caseContent = [
              {
                message = { text = { text = ["First case"] } }
              },
              {
                additionalCases = {
                  cases = [
                    {
                      condition = "$sys.func.RAND() < 0.2"
                      caseContent = [
                        {
                          message = { text = { text = ["Nested case"] } }
                        }
                      ]
                    }
                  ]
                }
              }
            ]
          },
          {
            caseContent = [
              {
                message = { text = { text = ["Final case"] } }
              }
            ]
          },
        ])
      }
    }
    target_page = google_dialogflow_cx_page.my_page2.id
  }

  advanced_settings {
    dtmf_settings {
      enabled      = true
      max_digits   = 1
      finish_digit = "#"
    }
  }
}

resource "google_dialogflow_cx_page" "my_page2" {
  parent       = var.agent.start_flow
  display_name = "${var.name}MyPage2"
}

# resource "google_dialogflow_cx_webhook" "my_webhook" {
#   parent       = var.agent.id
#   display_name = "MyWebhook"
#   generic_web_service {
#     uri = "https://example.com"
#   }
# }
