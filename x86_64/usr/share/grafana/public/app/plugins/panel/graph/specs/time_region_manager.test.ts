import { TimeRegionManager, colorModes } from '../time_region_manager';
import moment from 'moment';

describe('TimeRegionManager', () => {
  function plotOptionsScenario(desc, func) {
    describe(desc, () => {
      const ctx: any = {
        panel: {
          timeRegions: [],
        },
        options: {
          grid: { markings: [] },
        },
        panelCtrl: {
          range: {},
          dashboard: {
            isTimezoneUtc: () => false,
          },
        },
      };

      ctx.setup = (regions, from, to) => {
        ctx.panel.timeRegions = regions;
        ctx.panelCtrl.range.from = from;
        ctx.panelCtrl.range.to = to;
        const manager = new TimeRegionManager(ctx.panelCtrl);
        manager.addFlotOptions(ctx.options, ctx.panel);
      };

      ctx.printScenario = () => {
        console.log(
          `Time range: from=${ctx.panelCtrl.range.from.format()}, to=${ctx.panelCtrl.range.to.format()}`,
          ctx.panelCtrl.range.from._isUTC
        );
        ctx.options.grid.markings.forEach((m, i) => {
          console.log(
            `Marking (${i}): from=${moment(m.xaxis.from).format()}, to=${moment(m.xaxis.to).format()}, color=${m.color}`
          );
        });
      };

      func(ctx);
    });
  }

  describe('When creating plot markings using local time', () => {
    plotOptionsScenario('for day of week region', ctx => {
      const regions = [{ fromDayOfWeek: 1, toDayOfWeek: 1, fill: true, line: true, colorMode: 'red' }];
      const from = moment('2018-01-01T00:00:00+01:00');
      const to = moment('2018-01-01T23:59:00+01:00');
      ctx.setup(regions, from, to);

      it('should add 3 markings', () => {
        expect(ctx.options.grid.markings.length).toBe(3);
      });

      it('should add fill', () => {
        const markings = ctx.options.grid.markings;
        expect(moment(markings[0].xaxis.from).format()).toBe(moment('2018-01-01T01:00:00+01:00').format());
        expect(moment(markings[0].xaxis.to).format()).toBe(moment('2018-01-02T00:59:59+01:00').format());
        expect(markings[0].color).toBe(colorModes.red.color.fill);
      });

      it('should add line before', () => {
        const markings = ctx.options.grid.markings;
        expect(moment(markings[1].xaxis.from).format()).toBe(moment('2018-01-01T01:00:00+01:00').format());
        expect(moment(markings[1].xaxis.to).format()).toBe(moment('2018-01-01T01:00:00+01:00').format());
        expect(markings[1].color).toBe(colorModes.red.color.line);
      });

      it('should add line after', () => {
        const markings = ctx.options.grid.markings;
        expect(moment(markings[2].xaxis.from).format()).toBe(moment('2018-01-02T00:59:59+01:00').format());
        expect(moment(markings[2].xaxis.to).format()).toBe(moment('2018-01-02T00:59:59+01:00').format());
        expect(markings[2].color).toBe(colorModes.red.color.line);
      });
    });

    plotOptionsScenario('for time from region', ctx => {
      const regions = [{ from: '05:00', fill: true, colorMode: 'red' }];
      const from = moment('2018-01-01T00:00+01:00');
      const to = moment('2018-01-03T23:59+01:00');
      ctx.setup(regions, from, to);

      it('should add 3 markings', () => {
        expect(ctx.options.grid.markings.length).toBe(3);
      });

      it('should add one fill at 05:00 each day', () => {
        const markings = ctx.options.grid.markings;

        expect(moment(markings[0].xaxis.from).format()).toBe(moment('2018-01-01T06:00:00+01:00').format());
        expect(moment(markings[0].xaxis.to).format()).toBe(moment('2018-01-01T06:00:00+01:00').format());
        expect(markings[0].color).toBe(colorModes.red.color.fill);

        expect(moment(markings[1].xaxis.from).format()).toBe(moment('2018-01-02T06:00:00+01:00').format());
        expect(moment(markings[1].xaxis.to).format()).toBe(moment('2018-01-02T06:00:00+01:00').format());
        expect(markings[1].color).toBe(colorModes.red.color.fill);

        expect(moment(markings[2].xaxis.from).format()).toBe(moment('2018-01-03T06:00:00+01:00').format());
        expect(moment(markings[2].xaxis.to).format()).toBe(moment('2018-01-03T06:00:00+01:00').format());
        expect(markings[2].color).toBe(colorModes.red.color.fill);
      });
    });

    plotOptionsScenario('for time to region', ctx => {
      const regions = [{ to: '05:00', fill: true, colorMode: 'red' }];
      const from = moment('2018-02-01T00:00+01:00');
      const to = moment('2018-02-03T23:59+01:00');
      ctx.setup(regions, from, to);

      it('should add 3 markings', () => {
        expect(ctx.options.grid.markings.length).toBe(3);
      });

      it('should add one fill at 05:00 each day', () => {
        const markings = ctx.options.grid.markings;

        expect(moment(markings[0].xaxis.from).format()).toBe(moment('2018-02-01T06:00:00+01:00').format());
        expect(moment(markings[0].xaxis.to).format()).toBe(moment('2018-02-01T06:00:00+01:00').format());
        expect(markings[0].color).toBe(colorModes.red.color.fill);

        expect(moment(markings[1].xaxis.from).format()).toBe(moment('2018-02-02T06:00:00+01:00').format());
        expect(moment(markings[1].xaxis.to).format()).toBe(moment('2018-02-02T06:00:00+01:00').format());
        expect(markings[1].color).toBe(colorModes.red.color.fill);

        expect(moment(markings[2].xaxis.from).format()).toBe(moment('2018-02-03T06:00:00+01:00').format());
        expect(moment(markings[2].xaxis.to).format()).toBe(moment('2018-02-03T06:00:00+01:00').format());
        expect(markings[2].color).toBe(colorModes.red.color.fill);
      });
    });

    plotOptionsScenario('for day of week from/to region', ctx => {
      const regions = [{ fromDayOfWeek: 7, toDayOfWeek: 7, fill: true, colorMode: 'red' }];
      const from = moment('2018-01-01T18:45:05+01:00');
      const to = moment('2018-01-22T08:27:00+01:00');
      ctx.setup(regions, from, to);

      it('should add 3 markings', () => {
        expect(ctx.options.grid.markings.length).toBe(3);
      });

      it('should add one fill at each sunday', () => {
        const markings = ctx.options.grid.markings;

        expect(moment(markings[0].xaxis.from).format()).toBe(moment('2018-01-07T01:00:00+01:00').format());
        expect(moment(markings[0].xaxis.to).format()).toBe(moment('2018-01-08T00:59:59+01:00').format());
        expect(markings[0].color).toBe(colorModes.red.color.fill);

        expect(moment(markings[1].xaxis.from).format()).toBe(moment('2018-01-14T01:00:00+01:00').format());
        expect(moment(markings[1].xaxis.to).format()).toBe(moment('2018-01-15T00:59:59+01:00').format());
        expect(markings[1].color).toBe(colorModes.red.color.fill);

        expect(moment(markings[2].xaxis.from).format()).toBe(moment('2018-01-21T01:00:00+01:00').format());
        expect(moment(markings[2].xaxis.to).format()).toBe(moment('2018-01-22T00:59:59+01:00').format());
        expect(markings[2].color).toBe(colorModes.red.color.fill);
      });
    });

    plotOptionsScenario('for day of week from region', ctx => {
      const regions = [{ fromDayOfWeek: 7, fill: true, colorMode: 'red' }];
      const from = moment('2018-01-01T18:45:05+01:00');
      const to = moment('2018-01-22T08:27:00+01:00');
      ctx.setup(regions, from, to);

      it('should add 3 markings', () => {
        expect(ctx.options.grid.markings.length).toBe(3);
      });

      it('should add one fill at each sunday', () => {
        const markings = ctx.options.grid.markings;

        expect(moment(markings[0].xaxis.from).format()).toBe(moment('2018-01-07T01:00:00+01:00').format());
        expect(moment(markings[0].xaxis.to).format()).toBe(moment('2018-01-08T00:59:59+01:00').format());
        expect(markings[0].color).toBe(colorModes.red.color.fill);

        expect(moment(markings[1].xaxis.from).format()).toBe(moment('2018-01-14T01:00:00+01:00').format());
        expect(moment(markings[1].xaxis.to).format()).toBe(moment('2018-01-15T00:59:59+01:00').format());
        expect(markings[1].color).toBe(colorModes.red.color.fill);

        expect(moment(markings[2].xaxis.from).format()).toBe(moment('2018-01-21T01:00:00+01:00').format());
        expect(moment(markings[2].xaxis.to).format()).toBe(moment('2018-01-22T00:59:59+01:00').format());
        expect(markings[2].color).toBe(colorModes.red.color.fill);
      });
    });

    plotOptionsScenario('for day of week to region', ctx => {
      const regions = [{ toDayOfWeek: 7, fill: true, colorMode: 'red' }];
      const from = moment('2018-01-01T18:45:05+01:00');
      const to = moment('2018-01-22T08:27:00+01:00');
      ctx.setup(regions, from, to);

      it('should add 3 markings', () => {
        expect(ctx.options.grid.markings.length).toBe(3);
      });

      it('should add one fill at each sunday', () => {
        const markings = ctx.options.grid.markings;

        expect(moment(markings[0].xaxis.from).format()).toBe(moment('2018-01-07T01:00:00+01:00').format());
        expect(moment(markings[0].xaxis.to).format()).toBe(moment('2018-01-08T00:59:59+01:00').format());
        expect(markings[0].color).toBe(colorModes.red.color.fill);

        expect(moment(markings[1].xaxis.from).format()).toBe(moment('2018-01-14T01:00:00+01:00').format());
        expect(moment(markings[1].xaxis.to).format()).toBe(moment('2018-01-15T00:59:59+01:00').format());
        expect(markings[1].color).toBe(colorModes.red.color.fill);

        expect(moment(markings[2].xaxis.from).format()).toBe(moment('2018-01-21T01:00:00+01:00').format());
        expect(moment(markings[2].xaxis.to).format()).toBe(moment('2018-01-22T00:59:59+01:00').format());
        expect(markings[2].color).toBe(colorModes.red.color.fill);
      });
    });

    plotOptionsScenario('for day of week from/to time region with daylight saving time', ctx => {
      const regions = [{ fromDayOfWeek: 7, from: '20:00', toDayOfWeek: 7, to: '23:00', fill: true, colorMode: 'red' }];
      const from = moment('2018-03-17T06:00:00+01:00');
      const to = moment('2018-04-03T06:00:00+02:00');
      ctx.setup(regions, from, to);

      it('should add 3 markings', () => {
        expect(ctx.options.grid.markings.length).toBe(3);
      });

      it('should add one fill at each sunday between 20:00 and 23:00', () => {
        const markings = ctx.options.grid.markings;

        expect(moment(markings[0].xaxis.from).format()).toBe(moment('2018-03-18T21:00:00+01:00').format());
        expect(moment(markings[0].xaxis.to).format()).toBe(moment('2018-03-19T00:00:00+01:00').format());

        expect(moment(markings[1].xaxis.from).format()).toBe(moment('2018-03-25T22:00:00+02:00').format());
        expect(moment(markings[1].xaxis.to).format()).toBe(moment('2018-03-26T01:00:00+02:00').format());

        expect(moment(markings[2].xaxis.from).format()).toBe(moment('2018-04-01T22:00:00+02:00').format());
        expect(moment(markings[2].xaxis.to).format()).toBe(moment('2018-04-02T01:00:00+02:00').format());
      });
    });

    plotOptionsScenario('for each day of week with winter time', ctx => {
      const regions = [{ fromDayOfWeek: 7, toDayOfWeek: 7, fill: true, colorMode: 'red' }];
      const from = moment('2018-10-20T14:50:11+02:00');
      const to = moment('2018-11-07T12:56:23+01:00');
      ctx.setup(regions, from, to);

      it('should add 3 markings', () => {
        expect(ctx.options.grid.markings.length).toBe(3);
      });

      it('should add one fill at each sunday', () => {
        const markings = ctx.options.grid.markings;

        expect(moment(markings[0].xaxis.from).format()).toBe(moment('2018-10-21T02:00:00+02:00').format());
        expect(moment(markings[0].xaxis.to).format()).toBe(moment('2018-10-22T01:59:59+02:00').format());

        expect(moment(markings[1].xaxis.from).format()).toBe(moment('2018-10-28T02:00:00+02:00').format());
        expect(moment(markings[1].xaxis.to).format()).toBe(moment('2018-10-29T00:59:59+01:00').format());

        expect(moment(markings[2].xaxis.from).format()).toBe(moment('2018-11-04T01:00:00+01:00').format());
        expect(moment(markings[2].xaxis.to).format()).toBe(moment('2018-11-05T00:59:59+01:00').format());
      });
    });
  });
});
