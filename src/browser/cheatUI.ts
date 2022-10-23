import {Page} from "puppeteer";

export async function cheatUI(page: Page) {
  await page.$eval("#leftColumnViewport", (elem) => {
    const htmlRaw = `
      <form>
        <fieldset>
          <legend>Cheat</legend>
          <label><input type="radio" id="cheatOn" name="cheat" value="true" checked>ON</label>
          <label style="margin-left: 1em;"><input type="radio" id="cheatOff" name="cheat" value="false">OFF</label>
        </fieldset>
      </form>
      <span style="display:none" id="actor"></span>`
    elem.innerHTML += htmlRaw;
  });
  await page.evaluate(() => {
    document.querySelectorAll<HTMLInputElement>('input[name=cheat]').forEach(elem => {
      elem.addEventListener('change', () => {
        document.getElementById("actor")!.innerHTML +=
            '<span data-type="cheat" data-value="' + elem.value + '" />';
      });
    });
  });
}
