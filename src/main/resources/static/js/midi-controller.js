angular.module('MidiApp', [])
   .controller('midi-controller', function($scope, $http) {

    $scope.tonalContainer = {};
    $scope.tonalOutput;

        $scope.playExample = function() {
            var Synth = function(audiolet, frequency) {
            	AudioletGroup.apply(this, [audiolet, 0, 1]);

                this.audiolet = new Audiolet();
                this.sine = new Sine(this.audiolet, frequency);
                this.modulator = new Saw(this.audiolet, 2 * frequency);
                this.modulatorMulAdd = new MulAdd(this.audiolet, frequency/2, frequency);

                this.gain = new Gain(this.audiolet);
                this.envelope = new PercussiveEnvelope(this.audiolet, 1, 0.2, 0.5,
                	function() {
                		this.audiolet.scheduler.addRelative(0, this.remove.bind(this));
                	}.bind(this)
                	);

                this.modulator.connect(this.modulatorMulAdd);
                this.modulatorMulAdd.connect(this.sine);
                this.envelope.connect(this.gain, 0, 1);
                this.sine.connect(this.gain);
                this.gain.connect(this.outputs[0]);

            };

            var AudioletApp = function() {
        	    this.audiolet = new Audiolet();

        	    //trying scales

        	    var scale = new MajorScale();
        	    var baseFrequency = 261.63;
        	    var octave = 0;
        	    var freq1 = scale.getFrequency(0, baseFrequency, octave);
        	    var freq2 = scale.getFrequency(1, baseFrequency, octave);
        	    var freq3 = scale.getFrequency(2, baseFrequency, octave);
        	    var freq4 = scale.getFrequency(3, baseFrequency, octave);
        	    var freq5 = scale.getFrequency(4, baseFrequency, octave);

//        	    var melodyA = new PSequence([262, 294, 330, 349]);
//        	    var melodyB = new PSequence([349, 330, 349, 392]);
//        	    var melodyC = new PSequence([440, 392, 349, 330]);
        	    var note = new PSequence([440]);

                var frequencyPattern = new PSequence([freq1, freq2, freq3, freq4, freq5], 1);
                var durationPattern = new PChoose([new PSequence([2])], Infinity);
//        	    var frequencyPattern = new PSequence([melodyA, melodyB, melodyC], 2);
//        	    var durationPattern = new PChoose([new PSequence([3, 1, 2, 2]),
//        	    								  new PSequence([2, 2, 1, 3]),
//        	    								  new PSequence([1, 2, 1, 2])],
//        	    								  Infinity);

        	    this.audiolet.scheduler.play([frequencyPattern], durationPattern,
        	    	function(frequency) {
        	    		var synth = new Synth(this.audiolet, frequency);
        	    		synth.connect(this.audiolet.output);
        	    	}.bind(this)
        	    	);
        	};

            extend (Synth, AudioletGroup);


            this.audioletApp = new AudioletApp();
        };

        $scope.chords = function() {
            var Synth = function(audiolet, frequency) {
                AudioletGroup.call(this, audiolet, 0, 1);
                // Basic wave
                this.saw = new Saw(audiolet, frequency);
                // Gain envelope
                this.gain = new Gain(audiolet);
                this.env = new PercussiveEnvelope(audiolet, 1, 0.1, 0.1,
                    function() {
                        this.audiolet.scheduler.addRelative(0, this.remove.bind(this));
                    }.bind(this)
                );
                this.envMulAdd = new MulAdd(audiolet, 0.3, 0);
                // Main signal path
                this.saw.connect(this.gain);
                this.gain.connect(this.outputs[0]);
                // Envelope
                this.env.connect(this.envMulAdd);
                this.envMulAdd.connect(this.gain, 0, 1);
            };
            extend(Synth, AudioletGroup);

            var SchedulerApp = function() {
                this.audiolet = new Audiolet();

                this.scale = new MajorScale();

                // I IV V progression
                var chordPattern = new PSequence([[0, 2, 4],
                                                  [3, 5, 7],
                                                  [4, 6, 8]]);
                // Play the progression
                this.audiolet.scheduler.play([chordPattern], 1,
                                             this.playChord.bind(this));
            };

            SchedulerApp.prototype.playChord = function(chord) {
                for (var i = 0; i < chord.length; i++) {
                    var degree = chord[i];
                    var frequency = this.scale.getFrequency(degree, 16.352, 4);
                    var synth = new Synth(this.audiolet, frequency);
                    synth.connect(this.audiolet.output);
                }
            };
            var app = new SchedulerApp();
        };

        $scope.stuff = function(tonalContainer) {


        }

   });
