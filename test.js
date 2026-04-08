
// A simple test runner
function describe(description, fn) {
  console.log(description);
  fn();
}

function it(description, fn) {
  try {
    fn();
    console.log(`  ✓ ${description}`);
  } catch (error) {
    console.error(`  ✗ ${description}`);
    console.error(error);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

// Tests for index.html
describe('index.html', () => {
  it('should have the correct title', () => {
    assert(document.title === '오늘의 날씨', 'Title is not "오늘의 날씨"');
  });

  it('should have a main heading', () => {
    const h1 = document.querySelector('h1');
    assert(h1 !== null, 'h1 element not found');
    assert(h1.textContent === '오늘의 날씨', 'h1 text is not "오늘의 날씨"');
  });

  it('should have a theme toggle button', () => {
    const button = document.getElementById('theme-toggle');
    assert(button !== null, 'Theme toggle button not found');
    assert(button.textContent === '테마 변경', 'Button text is not "테마 변경"');
  });

  it('should have a last updated paragraph', () => {
    const p = document.getElementById('last-updated');
    assert(p !== null, 'Last updated paragraph not found');
    assert(p.textContent.startsWith('정보 업데이트:'), 'Paragraph text is not correct');
  });

  it('should have a city selector with 7 options', () => {
    const select = document.getElementById('city-select');
    assert(select !== null, 'City select not found');
    assert(select.options.length === 7, 'City select does not have 7 options');
  });

  it('should have a details button', () => {
    const button = document.getElementById('details-button');
    assert(button !== null, 'Details button not found');
    assert(button.textContent === '오늘의 상세날씨', 'Button text is not "오늘의 상세날씨"');
  });

  it('should have a weather-card element', () => {
    const weatherCard = document.querySelector('weather-card');
    assert(weatherCard !== null, 'weather-card element not found');
  });
});
