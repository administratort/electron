import * as cp from 'child_process'
import * as path from 'path'
import { clipboard } from 'electron';

const touchBarSimulator = path.resolve(__dirname, '../external_binaries/Touch Bar Simulator.app/Contents/MacOS/Touch Bar Simulator')

const EMPTY_IMAGE = 'data:image/png;base64,'

describe.only('TouchBar API', () => {
  let robot: typeof import('robotjs')
  let simulatorChild: cp.ChildProcess

  before(async function () {
    try {
      robot = await import('robotjs')
    } catch {
      this.skip()
    }
  })

  beforeEach(async () => {
    simulatorChild = cp.spawn(touchBarSimulator)
    simulatorChild.stdout.on('data', (data) => console.log(data.toString()))
    await takeScreenshot()
  })

  afterEach(() => {
    simulatorChild.kill()
  })

  const takeScreenshot = async () => {
    clipboard.writeText('')
    robot.keyTap('6', ['control', 'shift', 'command'])
    while (clipboard.readImage().toDataURL() === EMPTY_IMAGE) {
      await new Promise(r => setTimeout(r, 50))
      robot.keyTap('6', ['control', 'shift', 'command'])
    }
    return clipboard.readImage().toDataURL()
  }

  it('the tests should be able to screenshot the touchbar', async () => {
    console.log(await takeScreenshot())
  })
})
