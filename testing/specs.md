Feature: Slide 02 · Menu / Index
  As a presenter or attendee
  I want the Menu slide to accurately list all six agenda items
  So that the audience knows what's coming before the talk begins

  Background:
    Given I open the presentation at "index.html"
    And the deck-stage component is mounted
    And I navigate to slide index 1

  # ─── Structure ───────────────────────────────

  Scenario: Menu word and caption are visible
    When I look at the left panel of the menu slide
    Then I should see the large heading "MENU"
    And I should see the caption "— What we're ordering tonight"

  Scenario: Exactly six agenda items are listed
    When I count the items inside ".s-menu .right"
    Then there should be exactly 6 items

  # ─── Individual items ────────────────────────

  Scenario Outline: Each agenda item shows its number, title and subtitle
    When I look at menu item number <n>
    Then the item number should be "<number>"
    And the item title should be "<title>"
    And the item subtitle should be "<subtitle>"

    Examples:
      | n | number | title                    | subtitle                                        |
      | 1 | 01     | The Lore                 | FROM SOLO DEV TO AGENTIC SOFTWARE ENGINEER      |
      | 2 | 02     | Two Sides of the Same Coin | CURSOR IDE-FIRST · CLAUDE CODE AGENT-FIRST    |
      | 3 | 03     | The Token Tab            | ECONOMICS OF AGENTIC ENGINEERING                |
      | 4 | 04     | Real-World Logic         | LIVE DEMO, NEW FEATURE                          |
      | 5 | 05     | The Payoff               | OUTSOURCING GRUNT WORK FOR CRAFTSMANSHIP        |
      | 6 | 06     | Recap                    | WHAT TO TAKE TO YOUR NEXT SPRINT                |

  # ─── Recap accent ────────────────────────────

  Scenario: The Recap item carries the orange accent CSS class
    When I inspect menu item number 6
    Then it should have the CSS class "recap"
    And its title "Recap" should be wrapped in an <em> tag

  Scenario: No other menu item has the recap accent class
    When I inspect menu items 1 through 5
    Then none of them should have the CSS class "recap"

  # ─── Chrome ──────────────────────────────────

  Scenario: The slide chrome shows the correct brand and slide number
    When I look at the chrome header
    Then it should contain the wordmark "SoftServe"
    And the meta section should contain "Going Dutch Code"
    And the meta section should contain "02"

  # ─── Layout ──────────────────────────────────

  Scenario: The slide is exactly 1920×1080 pixels
    When I measure the slide dimensions
    Then the width should be 1920 pixels
    And the height should be 1080 pixels

  Scenario: No text overflows the slide boundaries
    When I check the slide for text overflow
    Then scrollHeight should not exceed clientHeight
    And scrollWidth should not exceed clientWidth